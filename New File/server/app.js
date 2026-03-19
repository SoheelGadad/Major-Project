const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt"); // ✨ NEW: Imported bcrypt for password hashing

const app = express();
const assetRoutes = require("./routes/assetRoutes");
const authRoute = require("./routes/auth");
// const MaintenanceRoutes = require("./routes/MaintenanceRoutes");
const adminRoutes = require("./routes/AdminUsers");
const assignmentRoutes = require('./routes/assignmentRoutes');
const employee = require('./routes/employee');
const AdminUser = require('./models/AdminUser');
const database = mongoose.connection;

const Assignment = require('./models/Assignment');

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api", assetRoutes);
app.use("/api", authRoute);
// app.use('/api/maintenance', MaintenanceRoutes);// Ensure this route is used
app.use("/api", adminRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api", employee);


// ✨ UPDATED: Admin "Create User" route with hashing and automatic approval
app.post('/api/users', async (req, res) => {
    try {
        console.log("Admin creating user:", req.body);
        
        // 1. Hash the password before saving!
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // 2. Generate a userId if the frontend doesn't provide one
        const generatedUserId = req.body.userId || "EMP-" + Date.now();

        // 3. Assemble the user data (Admin-created users are 'approved' by default)
        const newUserData = {
            ...req.body,
            userId: generatedUserId,
            password: hashedPassword,
            status: req.body.status || 'approved' 
        };

        const newUser = new AdminUser(newUserData);
        await newUser.save();
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user from admin panel:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/api/assignments', async (req, res) => {
    const { userId, assetId, assignmentDate, status } = req.body;
    try {
        const newAssignment = new Assignment({ userId, assetId, assignmentDate, status });
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


const startServer = async () => {
  try {
    console.log("Checking environment variable:", process.env.MONGODB_URI);

    // Check if MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in the .env file.");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB Atlas Connected Successfully");

    // Start Express server
    const PORT = process.env.PORT || 5001;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

startServer();


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv").config();
// const app = express();
// const assetRoutes = require("./routes/assetRoutes");
// const authRoute = require("./routes/auth");
// // const MaintenanceRoutes = require("./routes/MaintenanceRoutes");
// const adminRoutes = require("./routes/AdminUsers");
// const assignmentRoutes = require('./routes/assignmentRoutes');
// const employee=require('./routes/employee');
// const AdminUser = require('./models/AdminUser');
// const database = mongoose.connection;

// const Assignment = require('./models/Assignment');

// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

// app.use("/api", assetRoutes);
// app.use("/api", authRoute);
// // app.use('/api/maintenance', MaintenanceRoutes);// Ensure this route is used
// app.use("/api", adminRoutes);
// app.use("/api/assignments", assignmentRoutes);
// app.use("/api", employee);


// app.post('/api/users', async (req, res) => {
//     try {
//       console.log(req.body)
//         const newUser = new AdminUser(req.body);
//         await newUser.save();
//         res.status(201).json(newUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });



// app.post('/api/assignments', async (req, res) => {
//     const { userId, assetId, assignmentDate, status } = req.body;
//     try {
//         const newAssignment = new Assignment({ userId, assetId, assignmentDate, status });
//         await newAssignment.save();
//         res.status(201).json(newAssignment);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });



// const startServer = async () => {
//   try {
//     console.log("Checking environment variable:", process.env.MONGODB_URI);

//     // Check if MongoDB URI exists
//     if (!process.env.MONGODB_URI) {
//       throw new Error("MONGODB_URI is missing in the .env file.");
//     }

//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });

//     console.log("MongoDB Atlas Connected Successfully");

//     // Start Express server
//     const PORT = process.env.PORT || 5001;

//     app.listen(PORT, "0.0.0.0", () => {
//       console.log(`Server is running on port ${PORT}`);
//     });

//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

// startServer();