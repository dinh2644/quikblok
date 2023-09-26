import DefaultLogo from "../assets/pfp-default.jpg";

export interface BlockInfoItem {
  blockName: string;
  email: string;
  username: string;
  password: string;
  securityQuestions: string[];
  picture: string;
}

export const BlockInfo: BlockInfoItem[] = [
  {
    blockName: "Gmail",
    email: "johndoe123@gmail.com",
    username: "johnnystar66666",
    password: "12345",
    securityQuestions: ["Whats ur fav food?", "Name of your first dog"],
    picture: DefaultLogo,
  },
  {
    blockName: "Facebook",
    email: "maryjane456@gmail.com",
    username: "maryjane123",
    password: "P@ssw0rd!",
    securityQuestions: [
      "What's your favorite color?",
      "Name of your childhood friend",
    ],
    picture: DefaultLogo,
  },
  {
    blockName: "Twitter",
    email: "tweetmaster789@gmail.com",
    username: "tweetbirdie",
    password: "Tw1tter#2023",
    securityQuestions: [
      "Favorite vacation spot?",
      "Name of your favorite teacher",
    ],
    picture: DefaultLogo,
  },
  {
    blockName: "Instagram",
    email: "instafan007@gmail.com",
    username: "insta_lover",
    password: "Inst@gram123",
    securityQuestions: ["Favorite movie?", "Name of your first crush"],
    picture: DefaultLogo,
  },
  {
    blockName: "LinkedIn",
    email: "careerbuilder456@gmail.com",
    username: "jobseeker321",
    password: "L1nk3din#2023",
    securityQuestions: ["Dream job?", "Name of your college roommate"],
    picture: DefaultLogo,
  },
  {
    blockName: "Amazon",
    email: "shopaholic123@gmail.com",
    username: "shopaholic",
    password: "Am@zonPrime!",
    securityQuestions: ["Last item you bought?", "Name of your favorite book"],
    picture: DefaultLogo,
  },
  {
    blockName: "Netflix",
    email: "bingewatcher789@gmail.com",
    username: "netflixaddict",
    password: "N3tflix&Chill",
    securityQuestions: ["Favorite TV show?", "Name of your childhood hero"],
    picture: DefaultLogo,
  },
  {
    blockName: "WhatsApp",
    email: "whatsup456@gmail.com",
    username: "whatsupuser",
    password: "W@tsApp@2023",
    securityQuestions: ["Best friend's name?", "Name of your first cellphone"],
    picture: DefaultLogo,
  },
  {
    blockName: "Snapchat",
    email: "snapme123@gmail.com",
    username: "snapchatlover",
    password: "Sn@pM3#2023",
    securityQuestions: ["Favorite emoji?", "Name of your high school crush"],
    picture: DefaultLogo,
  },
];
