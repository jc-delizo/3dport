import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
    booknook,
    stopcount,
    threejs,
    bootstrap,
    autocad,
    sass,
    imageverse,
    github,
    githublogo,
    gitlablogo,
    linkedinlogo,
    resumelogo
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "React Developer",
      icon: mobile,
    },
    {
      title: "Full Stack Web Developer",
      icon: backend,
    },
    {
      title: "CAD Designer",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    // {
    //   name: "Redux Toolkit",
    //   icon: redux,
    // },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
    {
      name: "git",
      icon: git,
    },
    {
      name: "figma",
      icon: figma,
    },
    {
      name: "bootstrap",
      icon: bootstrap,
    },
    {
      name: "sass",
      icon: sass,
    },
    {
      name: "autocad",
      icon: autocad
    }
  ];
  
  const experiences = [
    {
      title: "QA/QC Engineer",
      company_name: "SJ E&I",
      icon: starbucks,
      iconBg: "#383E56",
      date: "02/2016 - 09/2017",
      points: [
        "Inspecting PreLoop and Final Loop checks in DCS at the Pagbilao Power Plant.",
        "Identifying and troubleshooting issues to ensure safety and regulatory compliance.",
        "Committed to ongoing professional development and staying up-to-date with industry standards and best practices.",
        "Working collaboratively with teams to ensure timely project delivery.",
      ],
    },
    {
      title: "Project Engineer",
      company_name: "EISSS",
      icon: tesla,
      iconBg: "#E6DEDD",
      date: "10/2017 - 01/2021",
      points: [
        "Assess complex engineering problems across various plants and factories.",
        "Utilize CAD to convert assessments into easy-to-read system drawings for effective communication with clients and contractors.",
        "Provide analytical problem-solving abilities to effectively identify issues and provide innovative solutions.",
        "Demonstrate strong attention to detail to ensure accuracy in all work done.",
      ],
    },
    {
      title: "Content Moderator",
      company_name: "TaskUs",
      icon: shopify,
      iconBg: "#383E56",
      date: "02/2021 - Present",
      points: [
        "Specialize in video copyright and monetization for high-profile TikTok clients on YouTube.",
        "Utilize manual searches, reviews, and claims to protect and monetize clients' videos.",
        "Expertise in potential and Pex claims to identify copyright infringement and ensure effective protection and monetization.",
        "Contribute to the successful transition of numerous high-profile TikTok creators to YouTube.",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Sara Lee",
      designation: "CFO",
      company: "Acme Co",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients' success like Rick does.",
      name: "Chris Brown",
      designation: "COO",
      company: "DEF Corp",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      testimonial:
        "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
      name: "Lisa Wang",
      designation: "CTO",
      company: "456 Enterprises",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];
  
  const projects = [
    {
      name: "ImageVerse",
      description:
        "With ImageVerse, users can easily generate images using Dall-E's powerful image generation, save them to Cloudinary, and store them in a MongoDB database. The MERN stack provides a robust and scalable platform for the application, while Tailwind ensures a nice and responsive user interface.",
      tags: [
        {
          name: "dalle",
          color: "blue-text-gradient",
        },
        {
          name: "mernstack",
          color: "green-text-gradient",
        },
        {
          name: "tailwind",
          color: "pink-text-gradient",
        },
      ],
      image: imageverse,
      source_code_link: "https://6433eafe2e231e78ffc8c358--flourishing-mochi-9d739d.netlify.app/",
    },
    {
      name: "BookNook",
      description:
        "THIS PAGE IS CURRENTLY IN DEVELOPMENT. An ecommerce website that features books as products. It has user/admin functions that makes it possible to be used in real-world applications. I expect to finish it this at April 2023, with a design that resembles a nook where you can read books comfortably.",
      tags: [
        {
          name: "bootstrap",
          color: "blue-text-gradient",
        },
        {
          name: "mernstack",
          color: "green-text-gradient",
        },
        {
          name: "css",
          color: "pink-text-gradient",
        },
      ],
      image: booknook,
      source_code_link: "https://capstone-3-omega-navy.vercel.app/",
    },
    {
      name: "Stopwatch and Countdown Timer",
      description:
        "A stopwatch and countdown timer using HTML, CSS, and JavaScript languages. The design features a classic analog watch with black lining, with the stopwatch and countdown text in the center of the watch.",
      tags: [
        {
          name: "html",
          color: "blue-text-gradient",
        },
        {
          name: "javascript",
          color: "green-text-gradient",
        },
        {
          name: "css",
          color: "pink-text-gradient",
        },
      ],
      image: stopcount,
      source_code_link: "https://jc-delizo.github.io/stopcounter/",
    },
  ];

  const socmed = [
    {
      title: "GitHub",
      icon: githublogo,
      newtab_link: "https://github.com/jc-delizo"
    },
    {
      title: "GitLab",
      icon: gitlablogo,
      newtab_link: "https://gitlab.com/jcdelizo"
    },
    {
      title: "LinkedIn",
      icon: linkedinlogo,
      newtab_link: "http://www.linkedin.com/in/jc-delizo"
    },
    {
      title: "Resume",
      icon: resumelogo,
      newtab_link: "https://drive.google.com/file/d/16aG_r4J1qJRNfih6OQ7F3XSjIDTjB_gp/view?usp=sharing"
    },
  ];
  
  export { services, technologies, experiences, testimonials, projects, socmed };