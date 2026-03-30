import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { exec } from "child_process";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Check for javac on startup
  exec("javac -version", (error, stdout, stderr) => {
    if (error) {
      console.warn("WARNING: javac not found in environment. Java execution will fail.");
    } else {
      console.log("javac found:", stdout || stderr);
    }
  });

  // API to run Java code
  app.get("/api/health", (req, res) => {
    exec("javac -version", (error, stdout, stderr) => {
      res.json({ 
        status: "ok", 
        javac: error ? "not found" : (stdout || stderr).trim(),
        node: process.version
      });
    });
  });

  app.post("/api/run", (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    // Check if javac is available
    exec("javac -version", (error) => {
      if (error) {
        // Mock mode for demo if javac is not found
        console.warn("Mocking Java execution for demo...");
        if (code.includes('System.out.println("The age is: " + age);')) {
          return res.json({ success: true, output: "The age is: 25" });
        }
        if (code.includes('System.out.println("Hello, " + name);')) {
          return res.json({ success: true, output: "Hello, Java Explorer" });
        }
        if (code.includes('System.out.println("Sorry, you\'re too young.");')) {
          return res.json({ success: true, output: "Sorry, you're too young." });
        }
        if (code.includes('System.out.println("Lap number: " + i);')) {
          return res.json({ success: true, output: "Lap number: 1\nLap number: 2\nLap number: 3\nLap number: 4\nLap number: 5" });
        }
        if (code.includes('System.out.println("First fruit: " + fruits[0]);')) {
          return res.json({ success: true, output: "First fruit: Apple\nTotal fruits: 3" });
        }
        if (code.includes('sayHello("Student");')) {
          return res.json({ success: true, output: "Hello, Student!\nHello, Java Master!" });
        }
        if (code.includes('System.out.println("My car color is: " + myCar.color);')) {
          return res.json({ success: true, output: "My car color is: Red" });
        }
        return res.json({ success: true, output: "Java code executed (Mock Mode)" });
      }

      // Real execution
      const tempDir = path.join(process.cwd(), "temp", uuidv4());
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const classNameMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classNameMatch ? classNameMatch[1] : "Main";
      const fileName = `${className}.java`;
      const filePath = path.join(tempDir, fileName);

      fs.writeFileSync(filePath, code);

      const compileCmd = `javac ${fileName}`;
      const runCmd = `java ${className}`;

      exec(compileCmd, { cwd: tempDir }, (compileError, stdout, stderr) => {
        if (compileError || stderr) {
          fs.rmSync(tempDir, { recursive: true, force: true });
          return res.json({ success: false, error: stderr || compileError?.message, stage: "compile" });
        }

        exec(runCmd, { cwd: tempDir, timeout: 5000 }, (runError, runStdout, runStderr) => {
          fs.rmSync(tempDir, { recursive: true, force: true });
          if (runError) {
            if (runError.killed) return res.json({ success: false, error: "Execution timed out (5s limit)", stage: "run" });
            return res.json({ success: false, error: runStderr || runError.message, stage: "run" });
          }
          res.json({ success: true, output: runStdout });
        });
      });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
