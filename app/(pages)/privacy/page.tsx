import React from "react";

const TnC = () => {
  return (
    <div className="container py-24 max-w-5xl prose dark:prose-invert">
      <h1>Privacy Policy</h1>

      <ol>
        <li>
          <h2>Introduction</h2>
          <p>
            Votik ("<strong>we</strong>", "<strong>us</strong>", or "
            <strong>our</strong>") values your privacy. This Privacy Policy
            outlines how we collect, use, share, and protect your personal
            information when you use our platform, accessible via our mobile
            application and website at <a href="https://votik.app">votik.app</a>
            .
          </p>
          <p>
            By using Votik, you agree to the collection and use of information
            as described in this policy. If you do not agree, please refrain
            from using our services.
          </p>
        </li>

        <li>
          <h2>Information We Collect</h2>
          <p>
            We collect various types of information to provide and improve our
            services:
          </p>
          <h3>Personal Information:</h3>
          <ul>
            <li>
              When you register an account, we may collect details like your
              name, email address, phone number, and location.
            </li>
            <li>
              When booking tickets, we may collect payment details (credit/debit
              card information, billing address).
            </li>
          </ul>
          <h3>Non-Personal Information:</h3>
          <ul>
            <li>
              We may collect non-identifiable information such as browsing data,
              device type, operating system, and IP address.
            </li>
            <li>
              Data on your interactions with our platform, including event
              preferences, favorite venues, and chatroom activities.
            </li>
          </ul>
        </li>

        <li>
          <h2>How We Use Your Information</h2>
          <p>We use the collected data to:</p>
          <ul>
            <li>Provide, personalize, and improve our services.</li>
            <li>Process your transactions and manage your account.</li>
            <li>
              Send you notifications, confirmations, and updates related to your
              events.
            </li>
            <li>Facilitate social features like Pre-Event Chatrooms.</li>
            <li>
              Provide customer support and address any inquiries or issues.
            </li>
            <li>
              Perform analytics to understand user behavior and improve our
              platform.
            </li>
            <li>Ensure security and prevent fraudulent activities.</li>
          </ul>
        </li>

        <li>
          <h2>Payment Processing</h2>
          <p>
            We use <strong>Razorpay</strong> as our trusted third-party payment
            processor to handle transactions. By making a purchase on Votik, you
            consent to the processing of your payment information by Razorpay in
            accordance with their Privacy Policy. We do not store your full
            payment details; they are securely handled by Razorpay.
          </p>
          <p>
            For more information on how Razorpay handles data, please refer to
            their <a href="https://razorpay.com/privacy">Privacy Policy</a>.
          </p>
        </li>

        <li>
          <h2>Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to:</p>
          <ul>
            <li>Enhance user experience by remembering preferences.</li>
            <li>
              Track user interactions for analytics and marketing purposes.
            </li>
          </ul>
          <p>
            You can adjust your browser settings to refuse cookies, but this may
            affect certain functionalities of our platform.
          </p>
        </li>

        <li>
          <h2>Sharing Your Information</h2>
          <p>
            We do not sell your personal information. However, we may share your
            data in the following situations:
          </p>
          <ul>
            <li>
              <strong>With Event Organizers:</strong> For event management and
              access.
            </li>
            <li>
              <strong>Third-Party Service Providers:</strong> For processing
              payments, analytics, and customer support, including Razorpay for
              payment processing.
            </li>
            <li>
              <strong>Legal Requirements:</strong> If required by law or to
              protect Votik's rights, property, or safety.
            </li>
            <li>
              <strong>Business Transfers:</strong> In case of a merger,
              acquisition, or asset sale.
            </li>
          </ul>
        </li>

        <li>
          <h2>Data Security</h2>
          <p>We prioritize the security of your data:</p>
          <ul>
            <li>
              We implement encryption and secure data transmission protocols.
            </li>
            <li>
              Access to your personal data is restricted to authorized personnel
              only.
            </li>
          </ul>
          <p>
            Although we take necessary precautions, no online platform can be
            completely secure. We encourage users to adopt best practices for
            online safety.
          </p>
        </li>

        <li>
          <h2>Retention of Data</h2>
          <p>
            We retain your personal information for as long as your account is
            active or as needed to provide you with our services. We may retain
            certain data to comply with legal obligations or resolve disputes.
          </p>
        </li>

        <li>
          <h2>Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the following rights:
          </p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of the personal data we
              hold.
            </li>
            <li>
              <strong>Correction:</strong> Update or correct inaccuracies in
              your personal data.
            </li>
            <li>
              <strong>Deletion:</strong> Request the deletion of your data,
              subject to legal limitations.
            </li>
            <li>
              <strong>Objection:</strong> Opt-out of certain data processing
              activities, such as marketing emails.
            </li>
          </ul>
          <p>
            To exercise your rights, contact us at{" "}
            <a href="mailto:mmpl@votik.app">mmpl@votik.app</a>.
          </p>
        </li>

        <li>
          <h2>Children's Privacy</h2>
          <p>
            Votik is not intended for individuals under the age of 18. We do not
            knowingly collect personal information from minors. If you believe a
            minor has provided us with personal information, please contact us
            so we can take appropriate action.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default TnC;
