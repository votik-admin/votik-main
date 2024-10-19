import __authors from "./jsons/__users.json";
import { AuthorType } from "./types";
import avatar1 from "@/app/images/avatars/Image-1.png";
import avatar2 from "@/app/images/avatars/Image-2.png";
import avatar3 from "@/app/images/avatars/Image-3.png";
import avatar4 from "@/app/images/avatars/Image-4.png";
import avatar5 from "@/app/images/avatars/Image-5.png";
import avatar6 from "@/app/images/avatars/Image-6.png";
import avatar7 from "@/app/images/avatars/Image-7.png";
import avatar8 from "@/app/images/avatars/Image-8.png";
import avatar9 from "@/app/images/avatars/Image-9.png";
import avatar10 from "@/app/images/avatars/Image-10.png";
import avatar11 from "@/app/images/avatars/Image-11.png";
import avatar12 from "@/app/images/avatars/Image-12.png";
import avatar13 from "@/app/images/avatars/Image-13.png";
import avatar14 from "@/app/images/avatars/Image-14.png";
import avatar15 from "@/app/images/avatars/Image-15.png";
import avatar16 from "@/app/images/avatars/Image-16.png";
import avatar17 from "@/app/images/avatars/Image-17.png";
import avatar18 from "@/app/images/avatars/Image-18.png";
import avatar19 from "@/app/images/avatars/Image-19.png";
import avatar20 from "@/app/images/avatars/Image-20.png";

const imgs = [
  avatar1.src,
  avatar2.src,
  avatar3.src,
  avatar4.src,
  avatar5.src,
  avatar6.src,
  avatar7.src,
  avatar8.src,
  avatar9.src,
  avatar10.src,
  avatar11.src,
  avatar12.src,
  avatar13.src,
  avatar14.src,
  avatar15.src,
  avatar16.src,
  avatar17.src,
  avatar18.src,
  avatar19.src,
  avatar20.src,
];

const DEMO_AUTHORS: AuthorType[] = __authors.map((item, index) => ({
  ...item,
  avatar: imgs[index] || item.avatar,
}));

export { DEMO_AUTHORS };
