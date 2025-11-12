#!/usr/bin/env node

/**
 * Admin Dashboard Setup & Testing Script
 * Run this to verify your admin dashboard installation
 */

console.log("\n🚀 WHISK LAYERS - ADMIN DASHBOARD SETUP CHECKER\n");

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

const checks = [];

// Check 1: Files exist
console.log(colors.blue + "📋 Checking Files..." + colors.reset);

const fs = require("fs");
const path = require("path");

const filesToCheck = [
  { path: "server/models/Order.js", name: "Order Model" },
  { path: "server/controllers/orderController.js", name: "Order Controller" },
  { path: "server/routes/orderRoutes.js", name: "Order Routes" },
  { path: "client/src/pages/AdminDashboard.js", name: "AdminDashboard Page" },
  { path: "client/src/styles/AdminDashboard.css", name: "AdminDashboard Styles" },
  { path: "client/src/components/Navbar.js", name: "Navbar Component" },
  { path: "client/src/App.js", name: "App.js" }
];

filesToCheck.forEach(file => {
  try {
    if (fs.existsSync(file.path)) {
      console.log(colors.green + "✓" + colors.reset + ` ${file.name} found`);
      checks.push({ name: file.name, status: "✓" });
    } else {
      console.log(colors.red + "✗" + colors.reset + ` ${file.name} NOT found at ${file.path}`);
      checks.push({ name: file.name, status: "✗" });
    }
  } catch (e) {
    console.log(colors.red + "✗" + colors.reset + ` Error checking ${file.name}: ${e.message}`);
    checks.push({ name: file.name, status: "✗" });
  }
});

// Check 2: Code snippets
console.log(colors.blue + "\n🔍 Checking Code Snippets..." + colors.reset);

try {
  const orderControllerContent = fs.readFileSync("server/controllers/orderController.js", "utf8");
  if (orderControllerContent.includes("getAdminOrders")) {
    console.log(colors.green + "✓" + colors.reset + " getAdminOrders function found");
    checks.push({ name: "getAdminOrders function", status: "✓" });
  } else {
    console.log(colors.red + "✗" + colors.reset + " getAdminOrders function NOT found");
    checks.push({ name: "getAdminOrders function", status: "✗" });
  }

  if (orderControllerContent.includes("updateOrderAdminStatus")) {
    console.log(colors.green + "✓" + colors.reset + " updateOrderAdminStatus function found");
    checks.push({ name: "updateOrderAdminStatus function", status: "✓" });
  } else {
    console.log(colors.red + "✗" + colors.reset + " updateOrderAdminStatus function NOT found");
    checks.push({ name: "updateOrderAdminStatus function", status: "✗" });
  }
} catch (e) {
  console.log(colors.red + "✗" + colors.reset + " Error reading orderController: " + e.message);
}

try {
  const orderRoutesContent = fs.readFileSync("server/routes/orderRoutes.js", "utf8");
  if (orderRoutesContent.includes("/admin/bakery")) {
    console.log(colors.green + "✓" + colors.reset + " Admin routes found");
    checks.push({ name: "Admin routes", status: "✓" });
  } else {
    console.log(colors.red + "✗" + colors.reset + " Admin routes NOT found");
    checks.push({ name: "Admin routes", status: "✗" });
  }
} catch (e) {
  console.log(colors.red + "✗" + colors.reset + " Error reading orderRoutes: " + e.message);
}

try {
  const appContent = fs.readFileSync("client/src/App.js", "utf8");
  if (appContent.includes("AdminDashboard")) {
    console.log(colors.green + "✓" + colors.reset + " AdminDashboard route found in App.js");
    checks.push({ name: "AdminDashboard route", status: "✓" });
  } else {
    console.log(colors.red + "✗" + colors.reset + " AdminDashboard route NOT found in App.js");
    checks.push({ name: "AdminDashboard route", status: "✗" });
  }
} catch (e) {
  console.log(colors.red + "✗" + colors.reset + " Error reading App.js: " + e.message);
}

try {
  const navbarContent = fs.readFileSync("client/src/components/Navbar.js", "utf8");
  if (navbarContent.includes("/admin-dashboard")) {
    console.log(colors.green + "✓" + colors.reset + " Admin Dashboard link in Navbar");
    checks.push({ name: "Navbar Admin link", status: "✓" });
  } else {
    console.log(colors.red + "✗" + colors.reset + " Admin Dashboard link NOT in Navbar");
    checks.push({ name: "Navbar Admin link", status: "✗" });
  }
} catch (e) {
  console.log(colors.red + "✗" + colors.reset + " Error reading Navbar: " + e.message);
}

try {
  const orderModelContent = fs.readFileSync("server/models/Order.js", "utf8");
  if (orderModelContent.includes("adminStatus") && orderModelContent.includes("bakery")) {
    console.log(colors.green + "✓" + colors.reset + " Order Model updated with adminStatus and bakery");
    checks.push({ name: "Order Model fields", status: "✓" });
  } else {
    console.log(colors.red + "✗" + colors.reset + " Order Model missing adminStatus or bakery field");
    checks.push({ name: "Order Model fields", status: "✗" });
  }
} catch (e) {
  console.log(colors.red + "✗" + colors.reset + " Error reading Order Model: " + e.message);
}

// Summary
console.log(colors.cyan + "\n📊 SUMMARY\n" + colors.reset);
const passedChecks = checks.filter(c => c.status === "✓").length;
const totalChecks = checks.length;

checks.forEach(check => {
  console.log(`  ${check.status} ${check.name}`);
});

console.log(colors.cyan + `\nPassed: ${passedChecks}/${totalChecks}\n` + colors.reset);

if (passedChecks === totalChecks) {
  console.log(colors.green + "✓ All checks passed! Your admin dashboard is ready to use.\n" + colors.reset);
  console.log(colors.yellow + "🚀 Next Steps:\n" + colors.reset);
  console.log("  1. Start the backend:  cd server && npm start");
  console.log("  2. Start the frontend: cd client && npm start");
  console.log("  3. Log in and click the '📊 Admin' button in navbar");
  console.log("  4. Enter your bakery ID to view orders");
  console.log("");
} else {
  console.log(colors.red + "✗ Some checks failed. Please review the errors above.\n" + colors.reset);
  console.log(colors.yellow + "Common Issues:\n" + colors.reset);
  console.log("  • Files not found: Ensure you're running this from the project root");
  console.log("  • Code not found: Re-read the ADMIN_DASHBOARD_GUIDE.md for setup");
  console.log("");
}

console.log(colors.blue + "📚 Documentation: Read ADMIN_DASHBOARD_GUIDE.md for complete guide\n" + colors.reset);
