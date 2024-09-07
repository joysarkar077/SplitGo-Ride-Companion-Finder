import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

const { EMAIL_NAME, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: "gmail",
  // port: 587,
  auth: {
    user: EMAIL_NAME,
    pass: EMAIL_PASS,
  },
});

export const sendVerigicationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const response = await transporter.sendMail({
      from: "istiakalimran@gmail.com",
      to: email,
      subject: "SplitGo verification code",
      html: await render(VerificationEmail({ username, otp: verifyCode })),
    });
    if (response) {
      console.log("Verification email sent");
      console.log(response);
      return {
        success: true,
        message: "Verification email sent",
      };
    } else {
      return {
        success: false,
        message: "Error sending verification email",
      };
    }
  } catch (emailError) {
    console.log("Error sending verification email");
    console.error(emailError);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
};
