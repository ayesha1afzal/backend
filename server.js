
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const items = require('./items');
const LogData = require('./LogData');
const router = express.Router();
// const Item = require('./item');
// const express = require('express');



const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
// Middleware
app.use(cors());
app.use(bodyParser.json());
// const cors = require('cors');


// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins (you can specify your frontend URL instead)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json()); // Ensure Express can parse JSON

// MongoDB connection
const mongoUri = 'mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority';
mongoose.connect(mongoUri)
   .then(() => console.log('MongoDB connected...'))
   .catch(err => console.log(err));

require('./UserDetail');
require('./skills');
require('./UserDetailed');

const User = mongoose.model("UserInfo");
const Skills = mongoose.model("Skills");
const MergedUser = mongoose.model( "MergedUser");
const Item = require("./items"); 

const JWT_SECRET = "hdidjnfbjsakjdhdiksmnhcujiksjieowpqlaskjdsolwopqpowidjxmmxm";

// Root route
app.get("/", (req, res) => {
   res.status(200).json({ message: "Root route is working!" });
});
app.post('/check-email', async (req, res) => {
   try {
     const { email } = req.body;
     const user = await User.findOne({ email });
     res.json({ exists: !!user });
   } catch (error) {
     console.error("Error checking email:", error);
     res.status(500).json({ error: "Internal server error" });
   }
 });


//  let nextUserId = 600;
// app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { user_id } = req.query;

//       if (!user_id) {
//          return res.status(400).json({ message: "first name is required" });
//       }

//       // Find the user in the database using email_y
//       const user = await UserDetailed.findOne({ user_id });

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

//       res.status(200).json({
//          status: "Ok",
//          data: {
//             user_id: user.user_id,
//             f_name: user.f_name,
//             l_name: user.l_name,
//             email: user.email_y,  // Fixing email field
//             age: user.age,
//             university: user.university,
//             user_name: user.user_name || "Not Set", // Handle undefined
//             gender: user.gender || "Not Specified",
//             skills_i_have: user.skills_i_have || "Not Set",
//             skills_i_want: user.skills_i_want || "Not Set",
//             availability: user.availability || "Not Set",
//             image: user.image || "No Image"
//          }
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });

// API to get user by email

// app.get('/getUserProfileByEmail', async (req, res) => {
//    try {
//       const { email } = req.query;
 
//       if (!email) {
//          return res.status(400).json({ message: "Email is required" });
//       }
 
//       const user = await MergedUser.findOne({ email });
 
//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }
 
//       res.status(200).json({
//         status: "Ok",
//         data: {
//            _id: user._id, // Include user ID here
//            Name: `${user.f_name} ${user.l_name}`,
//            university: user.university,
//            "Skills I Have": user.skills_i_have,
//            "Skills I Want": user.skills_i_want,
//            Availability: user.availability,
//            image: user.image
//         }
//      });
     
 
//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
//  });
app.get('/getUserProfileByEmail', async (req, res) => {
  try {
     const { email } = req.query;

     if (!email) {
        return res.status(400).json({ message: "Email is required" });
     }

     const user = await MergedUser.findOne({ email });

     if (!user) {
        return res.status(404).json({ message: "User not found" });
     }

     res.status(200).json({
       status: "Ok",
       data: {
          _id: user._id, // Include user ID here
          Name: `${user.f_name} ${user.l_name}`,
          university: user.university,
          "Skills I Have": user.skills_i_have,
          "Skills I Want": user.skills_i_want,
          Availability: user.availability,
          image: user.image
       }
    });
    

  } catch (error) {
     console.error("Error fetching user profile:", error);
     res.status(500).json({ message: "Internal server error" });
  }
});
 


// // bipartite

// // Function to perform bipartite matching
// const bipartiteMatch = (users) => {
//    let matches = [];
 
//    users.forEach((user1) => {
//      const [SkillsHave, SkillsWant] = user1.Skills;
 
//      users.forEach((user2) => {
//        if (user1.user_id !== user2.user_id) {
//          const [SkillsHave2, SkillsWant2] = user2.Skills;
         
//          // If user1 wants skill that user2 has, it's a match
//          if (SkillsWant.some(skill => SkillsHave2.includes(skill)) && SkillsWant2.some(skill => SkillsHave.includes(skill))) {
//            matches.push({ user1: user1.user_id, user2: user2.user_id });
//          }
//        }
//      });
//    });
 
//    return matches;
//  };
 
//  // Endpoint to fetch user preferences and apply bipartite matching
//  app.get("/userPreferences", async (req, res) => {
//    try {
//      const users = await MergedUser.find();
//      const userPreferences = users.map((user) => {
//        const SkillsHave = user.Skills_i_have ? user.Skills_i_have.split(',') : [];
//        const SkillsWant = user.Skills_i_want ? user.Skills_i_want.split(',') : [];
       
//        return {
//          user_id: user.user_id,
//          Skills: [SkillsHave, SkillsWant]
//        };
//      });
 
//      const matches = bipartiteMatch(userPreferences);
//      res.json({ userPreferences, matches });
//    } catch (err) {
//      res.status(500).json({ error: err.message });
//    }
//  });
 

// Save exchange history
app.get('/logdata', async (req, res) => {
   try {
     console.log("Incoming request for history:", req.query);
 
     const { email } = req.query;
 
     if (!email) {
       console.error(" Error: Email is required!");
       return res.status(400).json({ message: "Email is required" });
     }
 
     console.log('Fetching history for user: ${email})');
 
     const history = await LogData.find({ currentUser: email }).sort({ createdAt: -1 });
 
     console.log(" Retrieved history:", history);
 
     res.status(200).json({ status: "Ok", data: history });
 
   } catch (error) {
     console.error(" Error fetching history:", error);
     res.status(500).json({ message: "Internal server error" });
   }
 });
 
 app.get("/userPreferences", async (req, res) => {
  try {
    const { email, searchSkill } = req.query;

    if (!email || !searchSkill) {
      return res.status(400).json({ message: "User email and search skill are required" });
    }

    const loggedInUser = await MergedUser.findOne({ email });

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userSkillsHave = loggedInUser.skills_i_have
      ? loggedInUser.skills_i_have.toLowerCase().split(",")
      : [];

    const userSkillsWant = loggedInUser.skills_i_want
      ? loggedInUser.skills_i_want.toLowerCase().split(",")
      : [];

    const users = await MergedUser.find(
      { email: { $ne: email } },
      {
        user_id: 1,
        f_name: 1,
        l_name: 1,
        email: 1,
        gender: 1,
        skills_i_have: 1,
        skills_i_want: 1,
        availability: 1,
        _id: 0
      }
    );

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    let matches = [];

    // ✅ Only do perfect matching if the user *wants* the searched skill
    // if (userSkillsWant.includes(searchSkill.toLowerCase())) {
    //   users.forEach(user => {
    //     const tutorSkillsHave = user.skills_i_have
    //       ? user.skills_i_have.toLowerCase().split(",")
    //       : [];

    //     const tutorSkillsWant = user.skills_i_want
    //       ? user.skills_i_want.toLowerCase().split(",")
    //       : [];

    //     if (tutorSkillsHave.includes(searchSkill.toLowerCase())) {
    //       const mutualSkill = userSkillsHave.find(skill =>
    //         tutorSkillsWant.includes(skill)
    //       );

    //       if (mutualSkill) {
    //         matches.push({
    //           tutor: `${user.f_name} ${user.l_name}`,
    //           tutorEmail: user.email,
    //           tutorGender: user.gender || "Not specified",
    //           tutorTeaches: searchSkill,
    //           tutorWants: mutualSkill,
    //           tutorAvailability: user.availability || "Not specified",
    //           student: `${loggedInUser.f_name} ${loggedInUser.l_name}`,
    //           studentEmail: loggedInUser.email,
    //           studentTeaches: mutualSkill,
    //           studentWants: searchSkill
    //         });
    //       }
    //     }
    //   });
    // ✅ NEW: Always search tutors who have this skill
    users.forEach(user => {
      const tutorSkillsHave = user.skills_i_have
        ? user.skills_i_have.toLowerCase().split(",")
        : [];

      const tutorSkillsWant = user.skills_i_want
        ? user.skills_i_want.toLowerCase().split(",")
        : [];

      if (tutorSkillsHave.includes(searchSkill.toLowerCase())) {
        const mutualSkill = userSkillsWant.find(skill =>
          userSkillsHave.includes(skill)
        ) || userSkillsWant[0]; // fallback

        matches.push({
          tutor: `${user.f_name} ${user.l_name}`,
          tutorEmail: user.email,
          tutorGender: user.gender || "Not specified",
          tutorTeaches: searchSkill,
          tutorWants: mutualSkill || "Not specified",
          tutorAvailability: user.availability || "Not specified",
          student: `${loggedInUser.f_name} ${loggedInUser.l_name}`,
          studentEmail: loggedInUser.email,
          studentTeaches: mutualSkill || "Not specified",
          studentWants: searchSkill
        });
    }
  });
    // ✅ Always return the matches array (can be empty)
    return res.status(200).json({ status: "Ok", matches });
  } catch (error) {
    console.error("Error in /userPreferences:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

 app.post('/logdata', async (req, res) => {
   try {
     console.log("📌 Incoming request to save trade:", req.body);
 
     const { currentUser, tradedWith, exchangeType } = req.body;
 
     if (!currentUser || !tradedWith || !exchangeType) {
       console.error("❌ Missing required fields!");
       return res.status(400).json({ message: "All fields are required" });
     }
 
     const newLogData = new LogData({
       currentUser,
       tradedWith,
       exchangeType,
     });
 
     await newLogData.save();
     console.log("✅ Trade successfully saved:", newLogData);
 
     res.status(201).json({ message: "Trade saved", data: newLogData });
   } catch (error) {
     console.error("❌ Error saving trade data:", error);
     res.status(500).json({ message: "Internal server error" });
   }
 });
 
 // API to fetch user email by ID
 app.get("/user/:id", async (req, res) => {
   try {
       const userId = req.params.id;
       const user = await User.findById(userId).select("email"); // Only fetch email
 
       if (!user) {
           return res.status(404).json({ message: "User not found" });
       }
 
       res.status(200).json({ email: user.email });
   } catch (error) {
       console.error("❌ Error fetching user email:", error);
       res.status(500).json({ message: "Internal server error" });
   }
 });
 
 // API to fetch exchange history for a user
 

// //user id se
// app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { user_id } = req.query;

//       if (!user_id ) {
//          return res.status(400).json({ message: "User ID is required" });
//       }

//       const user = await MergedUser.findOne({user_id});
      
//       // Search by user_id if provided, otherwise search by email
      

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

//       res.status(200).json({
//          status: "Ok",
//          data: user
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });



// // ✅ API to Fetch Reviews for a User
// app.get("/getUserReviews", async (req, res) => {
//     try {
//         const { email } = req.query;

//         if (!email) {
//             return res.status(400).json({ message: "Email is required." });
//         }

//         // Find user and return only reviews
//         const user = await MergedUser.findOne({ email }, { reviews: 1, _id: 0 });

//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         res.status(200).json({ reviews: user.reviews });
//     } catch (error) {
//         console.error("Error fetching reviews:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// });
// ✅ API to Fetch Reviews by User Email
// app.get("/getUserReviews", async (req, res) => {
//   try {
//       const { email } = req.query;

//       if (!email) {
//           return res.status(400).json({ message: "Email is required." });
//       }

//       // Find user by email
//       const user = await User.findOne({ email }, { reviews: 1, _id: 0 });

//       if (!user) {
//           return res.status(404).json({ message: "User not found." });
//       }

//       res.status(200).json({ reviews: user.reviews });
//   } catch (error) {
//       console.error("Error fetching reviews:", error);
//       res.status(500).json({ message: "Internal server error." });
//   }
// });
app.get("/getUserReviews", async (req, res) => {
  try {
      const { email } = req.query;

      // Check if email is provided in the query parameters
      if (!email) {
          return res.status(400).json({ message: "Email is required." });
      }

      // Find user by email and only retrieve the 'reviews' field
      const user = await MergedUser.findOne({ email }, { reviews: 1, _id: 0 });

      // Log the result of the database query
      console.log('User found:', user); // Check what user data looks like

      // Check if the user was found
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      // Log the reviews separately for debugging
      console.log('Reviews:', user.reviews); // Check if reviews are populated correctly

      // If reviews are available, return them; otherwise, return a message
      if (user.reviews && Array.isArray(user.reviews) && user.reviews.length > 0) {
          return res.status(200).json({ reviews: user.reviews });
      } else {
          return res.status(200).json({ message: "No reviews available for this user." });
      }
  } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Internal server error." });
  }
});
//  app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { email } = req.query;

//       if (!email) {
//          return res.status(400).json({ message: "Email is required" });
//       }

//       // Find the user in the database
//       const user = await UserDetailed.findOne({ email });

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

      
//       res.status(200).json({
//          status: "Ok",
//          data: {
//             f_name: user.f_name,
//             l_name: user.l_name,
//             email: user.email,
//             age: user.age,
//             university: user.university,
//             user_name: user.user_name,
//             skills_i_have: skills ? skills.skills_i_have : [],
//             skills_i_want: skills ? skills.skills_i_want : [],
//             availability: skills ? skills.availability : "Not Set",
//          }
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });

// let nextUserId = 600;
// // Create account
// app.post('/CreateAccount', async (req, res) => {
//    try {

//       //, gender, user_id,  skills_i_want, skills_i_have,availability
//       const { f_name, l_name, email, age, university, username, password, gender } = req.body;

//       // Validate required fields
//       if (!f_name || !l_name || !email || !age || !university || !username || !password ) {
//         console.log("hey")
//         console.log(f_name, l_name, email, age, university, username, password)
//          return res.status(400).json({ message: "All fields are required" });

//       }

//       // Check if user already exists
//       const oldUser = await User.findOne({ email });
//       if (oldUser) {
//          return res.status(400).json({ message: "User already exists" });
//       }

//       // Encrypt the password
//       const encryptedPassword = await bcrypt.hash(password, 10);
//       const userId = nextUserId;
//       nextUserId++;
//       console.log("userId", userId);
//       console.log("next user",nextUserId);

//       // Create new user
//       const newUser = await User.create({
//          f_name,
//          l_name,
//          email,
//          age,
//          university,
//          username,
//          password: encryptedPassword,
//          user_id: userId,
//          gender
//       //  // From Skills collection
//       //    user_name,
//       //    user_id,
//       //    gender,
//       //    skills_i_want,
//       //    skills_i_have,
//       //    availability
//             });

//       res.status(201).json({ message: "User created successfully", data: newUser });
//    } catch (error) {
//       console.error("Error creating user:", error.message, error.stack);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });
let fallbackUserId = 677; // Default starting user_id
console.log("ju")

const getNextUserId = async () => {
  try {
      // Find the highest existing user_id
      const lastUser = await User.findOne({}, {}, { sort: { user_id: -1 } });

      let newUserId = lastUser && lastUser.user_id ? parseInt(lastUser.user_id) + 1 : fallbackUserId++;

      // Ensure uniqueness by checking if the ID exists
      while (await User.findOne({ user_id: newUserId })) {
          newUserId++; // Increment until we find a unique ID
      }

      return newUserId;
      
  } catch (error) {
      console.error("Error generating unique user ID:", error);
      return fallbackUserId++; // Fallback in case of error
  }
};



app.post('/CreateAccount', async (req, res) => {
  try {
     const { f_name, l_name, email, age, university, username, password, gender } = req.body;

     if (!f_name || !l_name || !email || !age || !university || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
     }

     // Check if user already exists
     const oldUser = await User.findOne({ email });
     if (oldUser) {
        return res.status(400).json({ message: "User already exists" });
     }

     // Generate unique user_id
     const userId = await getNextUserId();
     console.log("New unique user ID:", userId);

     // Encrypt password
     const encryptedPassword = await bcrypt.hash(password, 10);

     // Create user in `UserInfo`
     const newUser = await User.create({
        f_name,
        l_name,
        email,
        age: parseInt(age),
        university,
        username,
        password: encryptedPassword,
        user_id: userId,
        gender
     });

     // Create user in `MergedUser`
     await MergedUser.create({
        f_name,
        l_name,
        email,
        age: parseInt(age),
        university,
        username,
        password: encryptedPassword,
        user_id: userId,
        gender,
        skills_i_have: "",
        skills_i_want: "",
        availability: "",
     });

     res.status(201).json({ message: "User created successfully", data: newUser });

  } catch (error) {
     console.error("Error creating user:", error);
     res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// Add skills
// app.post("/AddSkills", async (req, res) => {
//    try {
//        const { email, Skills_i_have, Skills_i_want, availability } = req.body;

//        console.log("Request Body:", req.body); // Log received data

//        // Validate input
//        if (
//         !email ||
//         !Array.isArray(Skills_i_have) ||
//         !Array.isArray(Skills_i_want) ||
//         Skills_i_have.some(skill => !skill.Skill || !skill.category) ||
//         Skills_i_want.some(skill => !skill.Skill || !skill.category)
//     ) {
//         console.error("Invalid input format:", req.body);
//         return res.status(400).json({ message: "Invalid input format. Please provide an array of skills with categories." });
//     }

//        // Check if user exists
//        const user = await User.findOne({ email });
//        if (!user) {
//            console.error("User not found for email:", email);
//            return res.status(404).json({ message: "User not found." });
//        }

//        // Create new skill entry
//        const newSkill = await Skills.create({
//            user_id: user._id,
//            Skills_i_have,
//            Skills_i_want,
//            availability: availability || "",
//            email: user.email,
//        });

//        console.log("New skill added:", newSkill);
//        res.status(201).json({ message: "Skills added successfully", data: newSkill });
//    } catch (error) {
//        console.error("Error in /AddSkills endpoint:", error);
//        res.status(500).json({ message: "Internal server error" });
//    }
// });


// app.post("/AddSkills", async (req, res) => {
//    try {
//        const { email, Skills_i_have, Skills_i_want, availability } = req.body;

//        console.log("Request Body:", req.body); // Log received data

//        // Validate input
//       //  if (
//       //      !email ||
//       //      !Array.isArray(Skills_i_have) ||
//       //      !Array.isArray(Skills_i_want) ||
//       //      Skills_i_have.some(skill => !skill.Skill || !skill.category) ||
//       //      Skills_i_want.some(skill => !skill.Skill || !skill.category)
//       //  ) {
//       //      console.error("Invalid input format:", req.body);
//       //      return res.status(400).json({ message: "Invalid input format. Please provide an array of skills with categories." });
//       //  }
//       if (!email || !Skills_i_have || !Skills_i_want) {
//         return res.status(400).json({ message: "Missing required fields." });
//       }
//        // Check if user exists
//        const user = await User.findOne({ email });
//        if (!user) {
//            console.error("User not found for email:", email);
//            return res.status(404).json({ message: "User not found." });
//        }

//        // Ensure `user_id` is an ObjectId
//        const userId = new mongoose.Types.ObjectId(user._id);

//        // Create new skill entry
//        await Skills.create({
//         user_id: userId,
//         Skills_i_have: JSON.stringify(Skills_i_have),  // Convert array to string
//         Skills_i_want: JSON.stringify(Skills_i_want),  // Convert array to string
//         availability: availability || "",
//         email: user.email,
//     });

//        console.log("New skill added:", newSkill);
//        res.status(201).json({ message: "Skills added successfully", data: newSkill });
//    } catch (error) {
//        console.error("Error in /AddSkills endpoint:", error);
//        res.status(500).json({ message: "Internal server error" });
//    }
// });

//sahi wala add skills
// app.post("/AddSkills", async (req, res) => {
//   try {
//       const { user_id, email, Skills_i_have, category_skills_i_have, Skills_i_want, category_skills_i_want, availability } = req.body;

//       if (!user_id || !email || !Skills_i_have || !category_skills_i_have || !Skills_i_want || !category_skills_i_want) {
//         return res.status(400).json({ message: "Missing required fields." });
//       }

//       const newSkill = await Skills.create({
//           user_id: new mongoose.Types.ObjectId(user_id),
//           Skills_i_have: Skills_i_have || "",  
//           category_skills_i_have: category_skills_i_have || "",  

//           Skills_i_want: Skills_i_want || "",  
//           category_skills_i_want: category_skills_i_want || "",  

//           availability: availability || "",
//           email,
//       });
//       const updatedUser = await MergedUser.findOneAndUpdate(
//         { email }, 
//         { 
//           skills_i_have: Skills_i_have,
//           category_skills_i_have: category_skills_i_have,
//           skills_i_want: Skills_i_want,
//           category_skills_i_want: category_skills_i_want,
//           availability: availability 
//         },
//         { new: true } // Return updated document
//       );

//       res.status(201).json({ message: "Skills added successfully", data: newSkill });
//   } catch (error) {
//       console.error("Error in /AddSkills endpoint:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

//sahi wala ayesha k lap main
// app.post("/AddSkills", async (req, res) => {
//   try {
//       const { user_id, email, Skills_i_have, category_skills_i_have, Skills_i_want, category_skills_i_want, availability } = req.body;

//       if (!user_id || !email || !Skills_i_have || !category_skills_i_have || !Skills_i_want || !category_skills_i_want) {
//           return res.status(400).json({ message: "Missing required fields." });
//       }

//       // Check if the user already has skills
//       const existingSkill = await Skills.findOne({ email });

//       if (existingSkill) {
//           // ✅ Update `Skills` collection
//           await Skills.findOneAndUpdate(
//               { email },
//               {
//                   $set: {
//                       Skills_i_have,
//                       category_skills_i_have,
//                       Skills_i_want,
//                       category_skills_i_want,
//                       availability,
//                   },
//               },
//               { new: true }
//           );

//           // ✅ Update `MergedUser` collection
//           await MergedUser.findOneAndUpdate(
//               { email },
//               {
//                   $set: {
//                       skills_i_have: Skills_i_have,
//                       category_skills_i_have: category_skills_i_have,
//                       skills_i_want: Skills_i_want,
//                       category_skills_i_want: category_skills_i_want,
//                       availability,
//                   },
//               },
//               { new: true }
//           );

//           res.status(200).json({ message: "Skills updated successfully in both collections" });
//       } else {
//           // ✅ Create new entry in `Skills`
//           await Skills.create({
//               user_id: new mongoose.Types.ObjectId(user_id),
//               Skills_i_have,
//               category_skills_i_have,
//               Skills_i_want,
//               category_skills_i_want,
//               availability,
//               email,
//           });

//           // ✅ Ensure MergedUser is updated
//           await MergedUser.findOneAndUpdate(
//               { email },
//               {
//                   $set: {
//                       skills_i_have: Skills_i_have,
//                       category_skills_i_have: category_skills_i_have,
//                       skills_i_want: Skills_i_want,
//                       category_skills_i_want: category_skills_i_want,
//                       availability,
//                   },
//               },
//               { new: true }
//           );

//           res.status(201).json({ message: "Skills added successfully in both collections" });
//       }
//   } catch (error) {
//       console.error("Error in /AddSkills endpoint:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

// 24 april add skill
// app.post("/AddSkills", async (req, res) => { try { const { user_id, email, Skills_i_have, category_skills_i_have, Skills_i_want, category_skills_i_want, availability, } = req.body;

// if (!email) {
//   return res.status(400).json({ message: "Email is required." });
// }

// const existingSkill = await Skills.findOne({ email });

// if (existingSkill) {
//   // 🟡 Existing user — update only provided fields
//   const updatedFields = {};

//   if (Skills_i_have) updatedFields.Skills_i_have = Skills_i_have;
//   if (category_skills_i_have) updatedFields.category_skills_i_have = category_skills_i_have;
//   if (Skills_i_want) updatedFields.Skills_i_want = Skills_i_want;
//   if (category_skills_i_want) updatedFields.category_skills_i_want = category_skills_i_want;
//   if (availability) updatedFields.availability = availability;

//   await Skills.findOneAndUpdate({ email }, { $set: updatedFields }, { new: true });

//   await MergedUser.findOneAndUpdate(
//     { email },
//     {
//       $set: {
//         ...(Skills_i_have && { skills_i_have: Skills_i_have }),
//         ...(category_skills_i_have && { category_skills_i_have }),
//         ...(Skills_i_want && { skills_i_want: Skills_i_want }),
//         ...(category_skills_i_want && { category_skills_i_want }),
//         ...(availability && { availability }),
//       },
//     },
//     { new: true }
//   );

//   return res.status(200).json({ message: "Skills updated successfully in both collections" });
// } else {
//   // 🟢 New user — all fields are required
//   if (
//     !user_id ||
//     !Skills_i_have ||
//     !category_skills_i_have ||
//     !Skills_i_want ||
//     !category_skills_i_want ||
//     !availability
//   ) {
//     return res.status(400).json({ message: "All fields are required for new users." });
//   }

//   await Skills.create({
//     user_id: new mongoose.Types.ObjectId(user_id),
//     email,
//     Skills_i_have,
//     category_skills_i_have,
//     Skills_i_want,
//     category_skills_i_want,
//     availability,
//   });

//   await MergedUser.findOneAndUpdate(
//     { email },
//     {
//       $set: {
//         skills_i_have: Skills_i_have,
//         category_skills_i_have,
//         skills_i_want: Skills_i_want,
//         category_skills_i_want,
//         availability,
//       },
//     },
//     { new: true }
//   );

//   return res.status(201).json({ message: "Skills added successfully in both collections" });
// }
// } catch (error) { console.error("Error in /AddSkills endpoint:", error); return res.status(500).json({ message: "Internal server error" }); } });

// app.post("/UpdateSkill", async (req, res) => {
//   try {
//     const {
//       email,
//       newSkillHave,
//       newCategoryHave,
//       newSkillWant,
//       newCategoryWant,
//       availability,
//     } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     const userSkill = await Skills.findOne({ email });
//     if (!userSkill) {
//       return res.status(404).json({ message: "User not found in Skills collection." });
//     }

//     await Skills.findOneAndUpdate(
//       { email },
//       {
//         $set: {
//           ...(newSkillHave && { Skills_i_have: newSkillHave }),
//           ...(newCategoryHave && { category_skills_i_have: newCategoryHave }),
//           ...(newSkillWant && { Skills_i_want: newSkillWant }),
//           ...(newCategoryWant && { category_skills_i_want: newCategoryWant }),
//           ...(availability && { availability }),
//         },
//       },
//       { new: true }
//     );

//     const userMerged = await MergedUser.findOne({ email });
//     if (!userMerged) {
//       return res.status(404).json({ message: "User not found in MergedUser collection." });
//     }

//     await MergedUser.findOneAndUpdate(
//       { email },
//       {
//         $set: {
//           ...(newSkillHave && { skills_i_have: newSkillHave }),
//           ...(newCategoryHave && { category_skills_i_have: newCategoryHave }),
//           ...(newSkillWant && { skills_i_want: newSkillWant }),
//           ...(newCategoryWant && { category_skills_i_want: newCategoryWant }),
//           ...(availability && { availability }),
//         },
//       },
//       { new: true }
//     );

//     res.status(200).json({ message: "Skill updated successfully in both collections" });
//   } catch (error) {
//     console.error("Error updating skill:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

//24 april


//  app.post("/UpdateSkill", async (req, res) => {
//   try {
//       const { email, newSkill, newCategory, availability } = req.body;

//       if (!email || !newSkill || !newCategory) {
//           return res.status(400).json({ message: "Missing required fields." });
//       }

//       // Check if user exists
//       const user = await Skills.findOne({ email });

//       if (!user) {
//           return res.status(404).json({ message: "User not found." });
//       }

//       // Update skill for the existing user
//       await Skills.findOneAndUpdate(
//           { email },  // Find by email
//           {
//               $set: {
//                   Skills_i_have: newSkill,
//                   category_skills_i_have: newCategory,
//                   availability: availability || user.availability,
//               },
//           },
//           { new: true } // Return the updated document
//       );

//       // Also update MergedUser collection
//       await MergedUser.findOneAndUpdate(
//           { email },
//           {
//               $set: {
//                   skills_i_have: newSkill,
//                   category_skills_i_have: newCategory,
//                   availability: availability || user.availability,
//               },
//           },
//           { new: true }
//       );

//       res.status(200).json({ message: "Skill updated successfully" });
//   } catch (error) {
//       console.error("Error updating skill:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
// app.post("/UpdateSkill", async (req, res) => {
//   try {
//       const { email, newSkillHave, newCategoryHave, newSkillWant, newCategoryWant, availability } = req.body;

//       if (!email || !newSkillHave || !newCategoryHave || !newSkillWant || !newCategoryWant) {
//           return res.status(400).json({ message: "Missing required fields." });
//       }

//       // Check if user exists in `Skills` collection
//       const userSkill = await Skills.findOne({ email });

//       if (!userSkill) {
//           return res.status(404).json({ message: "User not found in Skills collection." });
//       }

//       // ✅ Update `Skills` collection
//       await Skills.findOneAndUpdate(
//           { email },
//           {
//               $set: {
//                   Skills_i_have: newSkillHave,
//                   category_skills_i_have: newCategoryHave,
//                   Skills_i_want: newSkillWant,
//                   category_skills_i_want: newCategoryWant,
//                   availability: availability || userSkill.availability,
//               },
//           },
//           { new: true }
//       );

//       // ✅ Update `MergedUser` collection
//       const userMerged = await MergedUser.findOne({ email });

//       if (!userMerged) {
//           return res.status(404).json({ message: "User not found in MergedUser collection." });
//       }

//       await MergedUser.findOneAndUpdate(
//           { email },
//           {
//               $set: {
//                   skills_i_have: newSkillHave,
//                   category_skills_i_have: newCategoryHave,
//                   skills_i_want: newSkillWant,
//                   category_skills_i_want: newCategoryWant,
//                   availability: availability || userMerged.availability,
//               },
//           },
//           { new: true }
//       );

//       res.status(200).json({ message: "Skill updated successfully in both collections" });
//   } catch (error) {
//       console.error("Error updating skill:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.post("/UpdateSkill", async (req, res) => { try 
//   { 
//   const { email, newSkillHave, newCategoryHave, newSkillWant, newCategoryWant, availability, } = req.body;
//   if (!email) {
//     return res.status(400).json({ message: "Email is required." });
//   }
  
//   // Check if user exists in Skills collection
//   const userSkill = await Skills.findOne({ email });
//   if (!userSkill) {
//     return res
//       .status(404)
//       .json({ message: "User not found in Skills collection." });
//   }
  
//   // Check if user exists in MergedUser collection
//   const userMerged = await MergedUser.findOne({ email });
//   if (!userMerged) {
//     return res
//       .status(404)
//       .json({ message: "User not found in MergedUser collection." });
//   }
  
//   // Build dynamic updates for Skills
//   const skillsUpdate = {};
//   if (newSkillHave !== undefined) {
//     skillsUpdate.Skills_i_have = newSkillHave;
//   }
//   if (newCategoryHave !== undefined) {
//     skillsUpdate.category_skills_i_have = newCategoryHave;
//   }
//   if (newSkillWant !== undefined) {
//     skillsUpdate.Skills_i_want = newSkillWant;
//   }
//   if (newCategoryWant !== undefined) {
//     skillsUpdate.category_skills_i_want = newCategoryWant;
//   }
//   if (availability !== undefined) {
//     skillsUpdate.availability = availability;
//   }
  
//   // Build dynamic updates for MergedUser
//   const mergedUpdate = {};
//   if (newSkillHave !== undefined) {
//     mergedUpdate.skills_i_have = newSkillHave;
//   }
//   if (newCategoryHave !== undefined) {
//     mergedUpdate.category_skills_i_have = newCategoryHave;
//   }
//   if (newSkillWant !== undefined) {
//     mergedUpdate.skills_i_want = newSkillWant;
//   }
//   if (newCategoryWant !== undefined) {
//     mergedUpdate.category_skills_i_want = newCategoryWant;
//   }
//   if (availability !== undefined) {
//     mergedUpdate.availability = availability;
//   }
  
//   if (
//     Object.keys(skillsUpdate).length === 0 &&
//     Object.keys(mergedUpdate).length === 0
//   ) {
//     return res
//       .status(400)
//       .json({ message: "No fields provided to update." });
//   }
  
//   // Update both collections
//   await Skills.updateOne({ email }, { $set: skillsUpdate });
//   await MergedUser.updateOne({ email }, { $set: mergedUpdate });
  
//   res.status(200).json({
//     message: "Skill updated successfully in both collections.",
//   });

// } catch (error) { console.error("Error updating skill:", error); res.status(500).json({ message: "Internal server error" }); } });

//update ayesha laptop waka
// app.post("/UpdateSkill", async (req, res) => {
//   try {
//     const {
//       email,
//       newSkillHave,
//       newCategoryHave,
//       newSkillWant,
//       newCategoryWant,
//       availability,
//     } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     // Check if user exists in Skills collection
//     const userSkill = await Skills.findOne({ email });
//     if (!userSkill) {
//       return res.status(404).json({ message: "User not found in Skills collection." });
//     }

//     // Build dynamic update object for Skills
//     const skillsUpdate = {};
//     if (newSkillHave) skillsUpdate.Skills_i_have = newSkillHave;
//     if (newCategoryHave) skillsUpdate.category_skills_i_have = newCategoryHave;
//     if (newSkillWant) skillsUpdate.Skills_i_want = newSkillWant;
//     if (newCategoryWant) skillsUpdate.category_skills_i_want = newCategoryWant;
//     if (availability) skillsUpdate.availability = availability;

//     await Skills.findOneAndUpdate({ email }, { $set: skillsUpdate });

//     // Check if user exists in MergedUser collection
//     const userMerged = await MergedUser.findOne({ email });
//     if (!userMerged) {
//       return res.status(404).json({ message: "User not found in MergedUser collection." });
//     }

//     // Build dynamic update object for MergedUser
//     const mergedUpdate = {};
//     if (newSkillHave) mergedUpdate.skills_i_have = newSkillHave;
//     if (newCategoryHave) mergedUpdate.category_skills_i_have = newCategoryHave;
//     if (newSkillWant) mergedUpdate.skills_i_want = newSkillWant;
//     if (newCategoryWant) mergedUpdate.category_skills_i_want = newCategoryWant;
//     if (availability) mergedUpdate.availability = availability;

//     await MergedUser.findOneAndUpdate({ email }, { $set: mergedUpdate });

//     res.status(200).json({ message: "Skill updated successfully." });
//   } catch (error) {
//     console.error("Error updating skill:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
  // app.post("/DeleteSkill", async (req, res) => {
//   try {
//       const { email } = req.body;

//       if (!email) {
//           return res.status(400).json({ message: "Email is required." });
//       }

//       // Ensure the user exists
//       const user = await Skills.findOne({ email });
//       if (!user) {
//           return res.status(404).json({ message: "User not found." });
//       }

//       // Remove skills from Skills collection
//       await Skills.updateOne(
//           { email },
//           {
//               $set: {
//                   Skills_i_have: "Not available at this moment",
//                   category_skills_i_have: "Not available at this moment",
//                   Skills_i_want: "Not available at this moment",
//                   category_skills_i_want: "Not available at this moment",
//                   availability: "Not available at this moment",
//               },
//           }
//       );

//       // Remove skills from MergedUser collection
//       await MergedUser.updateOne(
//           { email },
//           {
//               $set: {
//                   skills_i_have: "Not available at this moment",
//                   category_skills_i_have: "Not available at this moment",
//                   skills_i_want: "Not available at this moment",
//                   category_skills_i_want: "Not available at this moment",
//                   availability: "Not available at this moment",
//               },
//           }
//       );

//       res.status(200).json({ message: "Skills deleted successfully and marked as 'Not available at this moment'" });
//   } catch (error) {
//       console.error("Error deleting skill:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });



// app.post("/addItem", async (req, res) => {
//   try {
//     const {ItemName, Category, Condition, Description, Image } = req.body;

//     if ( !ItemName || !Category || !Condition || !Description || !Image) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newItem = new Item({
//       // _id: new mongoose.Types.ObjectId(_id),
//       // Name,
//       ItemName,
//       Category,
//       Condition,
//       Description,
//       Image,
//     });

//     await newItem.save();
//     res.status(201).json({ message: "Item added successfully", data: newItem });
//   } catch (error) {
//     console.error("Error adding item:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
app.post("/addItem", async (req, res) => {
  try {
    const { ItemName, Category, Condition, Description, Image, f_name, l_name, email } = req.body;


    if (!ItemName || !Category || !Condition || !Description || !Image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("BACKEND DATA:", { f_name, l_name, email });


    const newItem = new Item({
      ItemName,
      Category,
      Condition,
      Description,
      Image,
      f_name,
      l_name,
      email,
      Name: `${f_name} ${l_name}`, // add this for convenience in UI
    });

    await newItem.save();
    console.log("f_name:", f_name, "l_name:", l_name, "email:", email);
    res.status(201).json({ message: "Item added successfully", data: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Login
// app.post('/Login', async (req, res) => {
//    try {
//       const { email, password } = req.body;

//       const oldUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }); 

//       if (!oldUser) {
//          return res.status(404).json({ message: "User doesn't exist" });
//       }

//       const isPasswordValid = await bcrypt.compare(password, oldUser.password);
//       if (!isPasswordValid) {
//          return res.status(401).json({ message: "Invalid password" });
//       }

//       const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: "1h" });
//       res.status(200).json({ status: 'Ok', data: token });
//    } catch (error) {
//       console.error("Error during login:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });

app.post('/get-user-by-fullname', async (req, res) => {
   console.log('Request Body:', req.body); // Log the request body
   try {
     const { fullName } = req.body;
 
     if (!fullName) {
       return res.status(400).json({ error: "Full name is required" });
     }
 
     // Find user by matching concatenated name
     const users = await User.aggregate([
       {
         $addFields: {
           fullName: { $concat: ["$f_name", " ", "$l_name"] }
         }
       },
       {
         $match: {
           fullName: fullName
         }
       }
     ]);
 
     if (users.length === 0) {
       return res.status(404).json({ error: "User  not found" });
     }
 
     res.json({ email: users[0].email });
   } catch (error) {
     console.error("Error fetching user by full name:", error);
     res.status(500).json({ error: "Internal server error" });
   }
 });

// app.post('/Login', async (req, res) => {
//    try {
//      const { email, password } = req.body;
 
//      const oldUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
 
//      if (!oldUser) {
//        return res.status(404).json({ message: "User doesn't exist" });
//      }
 
//      const isPasswordValid = await bcrypt.compare(password, oldUser.password);
//      if (!isPasswordValid) {
//        return res.status(401).json({ message: "Invalid password" });
//      }
 
//      const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: "1h" });
//      res.status(200).json({
//        status: 'Ok',
//        data: {
//          token: token, // Include token here
//          user_id: oldUser._id, // Include other data if needed
//        },
//      });
//    } catch (error) {
//      console.error("Error during login:", error);
//      res.status(500).json({ message: "Internal server error" });
//    }
//  });
app.post('/Login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const oldUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!oldUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      status: 'Ok',
      data: {
        token: token, // Include token here
        user_id: oldUser._id, // Include other data if needed
        f_name: oldUser.f_name,
        l_name: oldUser.l_name,
        email: oldUser.email
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

 

// // Fetch user data
// app.post('/userdata', async (req, res) => {
//    const { token } = req.body;
//    try {
//       const user = jwt.verify(token, JWT_SECRET);
//       const useremail = user.email;

//       User.findOne({ email: useremail }).then((data) => {
//          return res.send({ status: "Ok", data: data });
//       });
//    } catch (error) {
//       return res.send({ error: "error" });
//    }
// });

//get user profile data


// Fetch recommended tutors
// app.get("/recommendedTutors", async (req, res) => {
//   try {
//      // Use default values to handle undefined query parameters
//      const skillsToLearn = req.query.skillsToLearn ? req.query.skillsToLearn.split(",") : [];
//      const skillsIHave = req.query.skillsIHave ? req.query.skillsIHave.split(",") : [];

//      const tutors = await Skills.find();
//      const sortedTutors = tutors.sort((a, b) => {
//         const aScore =
//            (skillsToLearn.includes(a["Skills I Have"]) ? 2 : 0) +
//            (skillsIHave.includes(a["Skills I Want"]) ? 1 : 0);
//         const bScore =
//            (skillsToLearn.includes(b["Skills I Have"]) ? 2 : 0) +
//            (skillsIHave.includes(b["Skills I Want"]) ? 1 : 0);
//         return bScore - aScore;
//      });

//      // Limit the results to the top 10 tutors
//      const limitedTutors = sortedTutors.slice(0, 500);

//      res.status(200).json({ status: "Ok", data: limitedTutors });
//   } catch (error) {
//      console.error("Error fetching tutors:", error);
//      res.status(500).json({ message: "Internal server error" });
//   }
// });


//sahi walaaa recommend
// app.get("/recommendedTutors", async (req, res) => {
//   try {
//     const SkillsToLearn = req.query.SkillsToLearn ? req.query.SkillsToLearn.split(",") : [];
//     const SkillsIHave = req.query.SkillsIHave ? req.query.SkillsIHave.split(",") : [];

//     // If no filters provided, return all tutors
//     let tutors;
//     if (SkillsToLearn.length === 0 && SkillsIHave.length === 0) {
//       tutors = await Skills.find(); // Return all tutors if no filters
//     } else {
//       tutors = await Skills.find({
//         $or: [
//           { "Skills_i_have.Skill": { $in: SkillsToLearn } },
//           { "Skills_i_want.Skill": { $in: SkillsIHave } }
//         ]
//       });
//       console.log("Fetched Tutors from DB:", tutors);
//     }

//     // Sort tutors based on matching score
//     const sortedTutors = tutors.sort((a, b) => {
//       const aScore =
//         (SkillsToLearn.includes(a["Skills I Have"]) ? 2 : 0) +
//         (SkillsIHave.includes(a["Skills I Want"]) ? 1 : 0);
//       const bScore =
//         (SkillsToLearn.includes(b["Skills I Have"]) ? 2 : 0) +
//         (SkillsIHave.includes(b["Skills I Want"]) ? 1 : 0);
//       return bScore - aScore;
//     });

//     const limitedTutors = sortedTutors.slice(0, 10); // Limit results

//     res.status(200).json({ status: "Ok", data: limitedTutors });
//   } catch (error) {
//     console.error("Error fetching tutors:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get("/allTutors", async (req, res) => {
  try {
    const tutors = await MergedUser.find({}, {
      f_name: 1,
      l_name: 1,
      email: 1,
      gender: 1,
      skills_i_have: 1,
      skills_i_want: 1,
      availability: 1,
      image: 1,
    });

    res.status(200).json({ status: "Ok", tutors });
  } catch (error) {
    console.error("Error fetching all tutors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.post("/submit-review", async (req, res) => {
//   try {
//       console.log("Received request body:", req.body);

//       const { reviewedUsername, reviewData } = req.body;

//       if (!reviewedUsername || !reviewData || !reviewData.rating || !reviewData.comment || !reviewData.reviewerUsername) {
//           console.log("Missing required fields:", req.body);
//           return res.status(400).json({ message: "Missing required fields" });
//       }

//       console.log("Searching for user with username:", reviewedUsername);

//       // Find the user by username
//       const user = await MergedUser.findOne({ email: reviewedUsername });

//       if (!user) {
//           console.log("User not found in database:", reviewedUsername);
//           return res.status(404).json({ message: "User not found" });
//       }

//       console.log("User found, adding review...");

//       // Create a new review object
//       const newReview = {
//         reviewerUsername: reviewData.reviewerUsername,
//         rating: reviewData.rating,
//         comment: reviewData.comment,
//         timestamp: new Date()
//     };
    

//       // Push the review to the user's reviews array
//       await MergedUser.updateOne(
//         { email: reviewedUsername },
//         { $push: { reviews: newReview } }
//     );
    

//       console.log("Review added successfully:", newReview);
//       res.status(201).json({ message: "Review submitted successfully", review: newReview });
//   } catch (error) {
//       console.error("Error saving review:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//   }
// });
app.post("/submit-review", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { reviewedUsername, reviewData, context } = req.body;

    if (
      !reviewedUsername ||
      !reviewData ||
      !reviewData.rating ||
      !reviewData.comment ||
      !reviewData.reviewerUsername
    ) {
      console.log("Missing required fields:", req.body);
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Searching for user with username:", reviewedUsername);

    // Find the user by email
    const user = await MergedUser.findOne({ email: reviewedUsername });

    if (!user) {
      console.log("User not found in database:", reviewedUsername);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found, adding review...");

    const newReview = {
      reviewerUsername: reviewData.reviewerUsername,
      rating: reviewData.rating,
      comment: reviewData.comment,
      timestamp: new Date(),
    };

    // Push to reviews
    await MergedUser.updateOne(
      { email: reviewedUsername },
      { $push: { reviews: newReview } }
    );

    // 👇 Add to logdata collection for history page
    const exchangeType = context === "Skill" ? "Skill" : "Item";
    await LogData.create({
      // currentUser: reviewData.reviewerUsername,
      currentUser: reviewData.reviewerEmail, // ✅ Use email to match history fetch
      tradedWith: reviewedUsername,
      exchangeType: exchangeType,
    });
    

    console.log("Review and log entry added successfully.");
    res
      .status(201)
      .json({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/delete-item", async (req, res) => {
  try {
    const { itemName, ownerEmail } = req.body;

    if (!itemName || !ownerEmail) {
      return res.status(400).json({ message: "Missing itemName or ownerEmail" });
    }

    const result = await Item.deleteOne({ ItemName: itemName, email: ownerEmail })


    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found or already deleted" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/recommendedTutors", async (req, res) => {
  try {
    const SkillsToLearn = req.query.SkillsToLearn ? req.query.SkillsToLearn.split(",") : [];
    const SkillsIHave = req.query.SkillsIHave ? req.query.SkillsIHave.split(",") : [];

    let tutors;
    
    if (SkillsToLearn.length === 0 && SkillsIHave.length === 0) {
      // If no filters provided, return only 10 tutors from `MergedUser `
      tutors = await MergedUser .find({}, { 
        f_name: 1, 
        l_name: 1, 
        email: 1, 
        university: 1, 
        gender: 1,
        skills_i_have: 1, 
        skills_i_want: 1, 
        availability: 1, 
        image: 1
      }) // Limit to 10 tutors
    } else {
      // Fetch tutors whose `skills_i_have` matches `SkillsToLearn`
      // OR whose `skills_i_want` matches `SkillsIHave`
      tutors = await MergedUser .find({
        $or: [
          { skills_i_have: { $regex: SkillsToLearn.map(skill => skill.toLowerCase()).join("|"), $options: "i" } },
          { skills_i_want: { $regex: SkillsIHave.map(skill => skill.toLowerCase()).join("|"), $options: "i" } }
        ]
      }, {
        f_name: 1, 
        l_name: 1, 
        email: 1, 
        university: 1, 
        gender: 1,
        skills_i_have: 1, 
        skills_i_want: 1, 
        availability: 1, 
        image: 1
      });
    }

    console.log("Fetched Tutors from DB:", tutors);

    // Sort tutors based on skill match score
    const sortedTutors = tutors.sort((a, b) => {
      const aScore =
        (SkillsToLearn.some(skill => a.skills_i_have?.toLowerCase().includes(skill.toLowerCase())) ? 2 : 0) +
        (SkillsIHave.some(skill => a.skills_i_want?.toLowerCase().includes(skill.toLowerCase())) ? 1 : 0);
      const bScore =
        (SkillsToLearn.some(skill => b.skills_i_have?.toLowerCase().includes(skill.toLowerCase())) ? 2 : 0) +
        (SkillsIHave.some(skill => b.skills_i_want?.toLowerCase().includes(skill.toLowerCase())) ? 1 : 0);
      return bScore - aScore;
    });

    res.status(200).json({ status: "Ok", data: sortedTutors });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//24 april update skill
// app.post("/UpdateSkill", async (req, res) => {
//   try {
//     const {
//       email,
//       newSkillHave,
//       newCategoryHave,
//       newSkillWant,
//       newCategoryWant,
//       availability,
//     } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     const userSkill = await Skills.findOne({ email });
//     if (!userSkill) {
//       return res.status(404).json({ message: "User not found in Skills collection." });
//     }

//     await Skills.findOneAndUpdate(
//       { email },
//       {
//         $set: {
//           ...(newSkillHave && { Skills_i_have: newSkillHave }),
//           ...(newCategoryHave && { category_skills_i_have: newCategoryHave }),
//           ...(newSkillWant && { Skills_i_want: newSkillWant }),
//           ...(newCategoryWant && { category_skills_i_want: newCategoryWant }),
//           ...(availability && { availability }),
//         },
//       },
//       { new: true }
//     );

//     const userMerged = await MergedUser.findOne({ email });
//     if (!userMerged) {
//       return res.status(404).json({ message: "User not found in MergedUser collection." });
//     }

//     await MergedUser.findOneAndUpdate(
//       { email },
//       {
//         $set: {
//           ...(newSkillHave && { skills_i_have: newSkillHave }),
//           ...(newCategoryHave && { category_skills_i_have: newCategoryHave }),
//           ...(newSkillWant && { skills_i_want: newSkillWant }),
//           ...(newCategoryWant && { category_skills_i_want: newCategoryWant }),
//           ...(availability && { availability }),
//         },
//       },
//       { new: true }
//     );

//     res.status(200).json({ message: "Skill updated successfully in both collections" });
//   } catch (error) {
//     console.error("Error updating skill:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

app.post("/AddSkills", async (req, res) => { try { const { user_id, email, Skills_i_have, category_skills_i_have, Skills_i_want, category_skills_i_want, availability, } = req.body;

if (!email) {
  return res.status(400).json({ message: "Email is required." });
}

const existingSkill = await Skills.findOne({ email });

if (existingSkill) {
  // 🟡 Existing user — update only provided fields
  const updatedFields = {};

  if (Skills_i_have) updatedFields.Skills_i_have = Skills_i_have;
  if (category_skills_i_have) updatedFields.category_skills_i_have = category_skills_i_have;
  if (Skills_i_want) updatedFields.Skills_i_want = Skills_i_want;
  if (category_skills_i_want) updatedFields.category_skills_i_want = category_skills_i_want;
  if (availability) updatedFields.availability = availability;

  await Skills.findOneAndUpdate({ email }, { $set: updatedFields }, { new: true });

  await MergedUser.findOneAndUpdate(
    { email },
    {
      $set: {
        ...(Skills_i_have && { skills_i_have: Skills_i_have }),
        ...(category_skills_i_have && { category_skills_i_have }),
        ...(Skills_i_want && { skills_i_want: Skills_i_want }),
        ...(category_skills_i_want && { category_skills_i_want }),
        ...(availability && { availability }),
      },
    },
    { new: true }
  );

  return res.status(200).json({ message: "Skills updated successfully in both collections" });
} else {
  // 🟢 New user — all fields are required
  if (
    !user_id ||
    !Skills_i_have ||
    !category_skills_i_have ||
    !Skills_i_want ||
    !category_skills_i_want ||
    !availability
  ) {
    return res.status(400).json({ message: "All fields are required for new users." });
  }

  await Skills.create({
    user_id: new mongoose.Types.ObjectId(user_id),
    email,
    Skills_i_have,
    category_skills_i_have,
    Skills_i_want,
    category_skills_i_want,
    availability,
  });

  await MergedUser.findOneAndUpdate(
    { email },
    {
      $set: {
        skills_i_have: Skills_i_have,
        category_skills_i_have,
        skills_i_want: Skills_i_want,
        category_skills_i_want,
        availability,
      },
    },
    { new: true }
  );

  return res.status(201).json({ message: "Skills added successfully in both collections" });
}
} catch (error) { console.error("Error in /AddSkills endpoint:", error); return res.status(500).json({ message: "Internal server error" }); } });

app.post("/UpdateSkill", async (req, res) => {
  try {
    const {
      email,
      newSkillHave,
      newCategoryHave,
      newSkillWant,
      newCategoryWant,
      availability,
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const userSkill = await Skills.findOne({ email });
    if (!userSkill) {
      return res.status(404).json({ message: "User not found in Skills collection." });
    }

    await Skills.findOneAndUpdate(
      { email },
      {
        $set: {
          ...(newSkillHave && { Skills_i_have: newSkillHave }),
          ...(newCategoryHave && { category_skills_i_have: newCategoryHave }),
          ...(newSkillWant && { Skills_i_want: newSkillWant }),
          ...(newCategoryWant && { category_skills_i_want: newCategoryWant }),
          ...(availability && { availability }),
        },
      },
      { new: true }
    );

    const userMerged = await MergedUser.findOne({ email });
    if (!userMerged) {
      return res.status(404).json({ message: "User not found in MergedUser collection." });
    }

    await MergedUser.findOneAndUpdate(
      { email },
      {
        $set: {
          ...(newSkillHave && { skills_i_have: newSkillHave }),
          ...(newCategoryHave && { category_skills_i_have: newCategoryHave }),
          ...(newSkillWant && { skills_i_want: newSkillWant }),
          ...(newCategoryWant && { category_skills_i_want: newCategoryWant }),
          ...(availability && { availability }),
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Skill updated successfully in both collections" });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// // // Fetch recommended skills
// // app.get('/recommendedSkills', async (req, res) => {
// //   try {
// //     const { search } = req.query;

// //     // Build a dynamic search filter
// //     const filter = {};
// //     if (search) {
// //       filter["Skills I Want"] = { $regex: search, $options: "i" }; // Case-insensitive regex search
// //     }

// //     const skills = await Skills.find(filter, { 
// //       "Skills I Want": 1, 
// //       "Category (Skills I Want)": 1,
// //       "image": 1, 
// //       _id: 0 
// //     }).limit(10);

// //     res.status(200).json({ status: 'Ok', data: skills });
// //   } catch (error) {
// //     console.error('Error fetching skills:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // });


router.get("/tutorProfile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const skillsData = await Skills.findOne({ user_id: id }); // Fix query
    const userInfo = await User.findOne({ _id: id }); // Ensure User query is correct

    if (!skillsData || !userInfo) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json({
      name: userInfo.name,
      university: userInfo.university,
      availability: skillsData.availability,
      skills: skillsData.Skills_i_have, // Fix capitalization
      learn: skillsData.Skills_i_want,
    });
  } catch (error) {
    console.error("Tutor Profile API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch recommended items
app.get('/recommendedItems', async (req, res) => {
   try {
      // const RItems = await items.find({}, {
      //    Name: 1,
      //    ItemName: 1,
      //    Category: 1,
      //    Condition: 1,
      //    Description: 1,
      //    Image: 1
      // });
      const RItems = await items.find({}, {
        Name: 1,
        ItemName: 1,
        Category: 1,
        Condition: 1,
        Description: 1,
        Image: 1,
        f_name: 1,  // ✅ add this
        l_name: 1,  // ✅ and this
        email: 1
      });
      

      res.status(200).json({ status: 'Ok', data: RItems });
   } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
});

// Update your server endpoint to handle search
app.get('/searchItems', async (req, res) => {
   try {
     const { query } = req.query;
     if (!query) {
       return res.status(400).json({ message: 'Search query is required' });
     }
 
     const searchTerms = query.toLowerCase().split(' ');
     
     const Items = await items.find({
       $or: [
         { ItemName: { $regex: searchTerms.join('|'), $options: 'i' } },
         { PersonName: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Category: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Condition: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Description: { $regex: searchTerms.join('|'), $options: 'i' } }
       ]
     });
 
     res.status(200).json({ status: 'Ok', data: Items });
   } catch (error) {
     console.error('Error searching items:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 });


// Start the server



app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

// API test endpoint
app.get('/api/test', (req, res) => {
   res.json({ message: 'API is connected!' });
});