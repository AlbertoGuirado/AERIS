import { Linkedin, Mail, Github } from "lucide-react";
import React from "react";
import iconDownloadCVUrl from "../assets/icons/IconDownloadCV.png";

export default function Frame() {
  const [copied, setCopied] = React.useState(false);
  const email = "albertoguifercontact@gmail.com"; 

  const handleEmailClick = () => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Error copiando email:", err));
  };

  const handleGithubClick = () => {
    window.open("https://github.com/AlbertoGuirado", "_blank");
  };

  const handleLinkedinClick = () => {
    window.open(
      "https://www.linkedin.com/in/alberto-guirado-fern%C3%A1ndez-baba45206/",
      "_blank"
    );
  };

  const handleCvClick = () => {
    window.open(
      "https://albertoguifer.vercel.app/",
      "_blank"
    );
  };

  const socialIcons = [
    {
      icon: <Linkedin className="w-8 h-8 text-white" />,
      alt: "LinkedIn",
      onClick: handleLinkedinClick,
    },
    {
      icon: <Github className="w-8 h-8 text-white" />,
      alt: "GitHub",
      onClick: handleGithubClick,
    },
    {
      icon: (
        <img
          src={iconDownloadCVUrl}
          alt="Download CV"
          className="w-10 h-10 text-white"
        />
      ),
      alt: "Download CV",
      onClick: handleCvClick,
    },
    {
      icon: <Mail className="w-8 h-8 text-white" />,
      alt: "Email",
      onClick: handleEmailClick,
    },
  ];

  return (
<div className="w-full max-w-[649px] h-[86px] mx-auto rounded-[10px] bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-around px-6 relative z-50 pointer-events-auto">
      {socialIcons.map((item, index) => (
        <div
          key={index}
          className="hover:scale-110 transition-transform duration-300 cursor-pointer"
          aria-label={item.alt}
          onClick={item.onClick}
        >
          {item.icon}
        </div>
      ))}

      {copied && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-teal-500 rounded-[10px] bg-white/10 backdrop-blur-md border border-white/20 text-white shadow animation-fade-in-10">
          Copied email!
        </div>
      )}
    </div>
  );
}
