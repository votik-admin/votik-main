import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const KEY = process.env.JWT_SECRET || "default_key";

// Base32 alphabet and encoding/decoding
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

// Function to pad the plaintext to be compatible with AES
const pad = (text: string): Buffer => {
  const blockSize = 16; // AES block size
  const padding = blockSize - (text.length % blockSize);
  const paddedText = Buffer.concat([
    Buffer.from(text),
    Buffer.alloc(padding, padding),
  ]);
  return paddedText;
};

// Function to unpad the decrypted text
const unpad = (buffer: Buffer): string => {
  const padding = buffer[buffer.length - 1];
  return buffer.slice(0, buffer.length - padding).toString("utf8");
};

// Custom Base32 encoding function
const base32Encode = (input: Buffer): string => {
  let output = "";
  const byteArray = Array.from(input);
  let buffer = 0;
  let bitsLeft = 0;

  for (let byte of byteArray) {
    buffer = (buffer << 8) | byte;
    bitsLeft += 8;

    while (bitsLeft >= 5) {
      const index = (buffer >> (bitsLeft - 5)) & 0x1f;
      output += BASE32_ALPHABET[index];
      bitsLeft -= 5;
    }
  }

  // Handle remaining bits
  if (bitsLeft > 0) {
    const index = (buffer << (5 - bitsLeft)) & 0x1f;
    output += BASE32_ALPHABET[index];
  }

  return output;
};

// Custom Base32 decoding function
const base32Decode = (input: string): Buffer => {
  const output: number[] = [];
  let buffer = 0;
  let bitsLeft = 0;

  for (let char of input) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) throw new Error("Invalid Base32 character");

    buffer = (buffer << 5) | index;
    bitsLeft += 5;

    if (bitsLeft >= 8) {
      output.push((buffer >> (bitsLeft - 8)) & 0xff);
      bitsLeft -= 8;
    }
  }

  return Buffer.from(output);
};

// Function to encrypt the plaintext
const encrypt = (plaintext: string, key: string = KEY): string => {
  const aesKey = scryptSync(key, "salt", 16);
  const cipher = createCipheriv("aes-128-ecb", aesKey, null);
  const paddedText = pad(plaintext);
  const encrypted = Buffer.concat([cipher.update(paddedText), cipher.final()]);

  // Base32 encode the encrypted text
  const base32Encoded = base32Encode(encrypted).toUpperCase();

  // Return the formatted string
  return `VOTIK${base32Encoded.slice(0, 10)}`;
};

// Function to decrypt the encrypted text
const decrypt = (encryptedText: string, key: string = KEY): string => {
  const aesKey = scryptSync(key, "salt", 16);
  const base32Data = encryptedText.slice(7, -1); // Remove VOTIK
  const decodedBuffer = base32Decode(base32Data);

  const decipher = createDecipheriv("aes-128-ecb", aesKey, null);
  const decrypted = Buffer.concat([
    decipher.update(decodedBuffer),
    decipher.final(),
  ]);

  return unpad(decrypted);
};

export { encrypt, decrypt };
