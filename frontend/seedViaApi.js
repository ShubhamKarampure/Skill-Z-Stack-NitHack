// const fetch = require('node-fetch'); // Uncomment if using Node.js < 18

// --- CONFIGURATION ---
const API_BASE_URL = process.env.API_URL || "http://localhost:3000/api/v1";
const DEFAULT_PASSWORD = "password";

// --- DATA LISTS ---
const PREDEFINED_WALLETS = [
  "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", // 0 (Admin)
  "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", // 1
  "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b", // 2
  "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d", // 3
  "0xd03ea8624C8C5987235048901fB614fDcA89b117", // 4
  "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC", // 5
  "0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9", // 6
  "0x28a8746e75304c0780E011BEd21C72cD78cd535E", // 7
  "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E", // 8
  "0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e", // 9
  "0x610Bb1573d1046FCb8A70Bbbd395754cD57C2b60", // 10
  "0x855FA758c77D68a04990E992aA4dcdeF899F654A", // 11
  "0xfA2435Eacf10Ca62ae6787ba2fB044f8733Ee843", // 12
  "0x64E078A8Aa15A41B85890265648e965De686bAE6", // 13
  "0x2F560290FEF1B3Ada194b6aA9c40aa71f8e95598", // 14
  "0xf408f04F9b7691f7174FA2bb73ad6d45fD5d3CBe", // 15
  "0x66FC63C2572bF3ADD0Fe5d44b97c2E614E35e9a3", // 16
  "0xF0D5BC18421fa04D0a2A2ef540ba5A9f04014BE3", // 17
  "0x325A621DeA613BCFb5B1A69a7aCED0ea4AfBD73A", // 18
  "0x3fD652C93dFA333979ad762Cf581Df89BaBa6795", // 19
  "0x73EB6d82CFB20bA669e9c178b718d770C49BB52f", // 20
  "0x9D8E5fAc117b15DaCED7C326Ae009dFE857621f1", // 21
  "0x982a8CbE734cb8c29A6a7E02a3B0e4512148F6F9", // 22
  "0xCDC1E53Bdc74bBf5b5F715D6327Dca5785e228B4", // 23
  "0xf5d1EAF516eF3b0582609622A221656872B82F78", // 24
  "0xf8eA26C3800D074a11bf814dB9a0735886C90197", // 25
  "0x2647116f9304abb9F0B7aC29aBC0D9aD540506C8", // 26
  "0x80a32A0E5cA81b5a236168C21532B32e3cBC95e2", // 27
  "0x47f55A2ACe3b84B0F03717224DBB7D0Df4351658", // 28
  "0xC817898296b27589230B891f144dd71A892b0C18", // 29
  "0x0D38e653eC28bdea5A2296fD5940aaB2D0B8875c", // 30
  "0x1B569e8f1246907518Ff3386D523dcF373e769B6", // 31
  "0xCBB025e7933FADfc7C830AE520Fb2FD6D28c1065", // 32
  "0xdDEEA4839bBeD92BDAD8Ec79AE4f4Bc2Be1A3974", // 33
  "0xBC2cf859f671B78BA42EBB65Deb31Cc7fEc07019", // 34
  "0xF75588126126DdF76bDc8aBA91a08f31d2567Ca5", // 35
  "0x369109C74ea7159E77e180f969f7D48c2bf19b4C", // 36
  "0xA2A628f4eEE25F5b02B0688Ad9c1290e2e9A3D9e", // 37
  "0x693D718cCfadE6F4A1379051D6ab998146F3173F", // 38
  "0x845A0F9441081779110FEE40E6d5d8b90cE676eF", // 39
  "0xC7739909e08A9a0F303A010d46658Bdb4d5a6786", // 40
  "0x99cce66d3A39C2c2b83AfCefF04c5EC56E9B2A58", // 41
  "0x4b930E7b3E491e37EaB48eCC8a667c59e307ef20", // 42
  "0x02233B22860f810E32fB0751f368fE4ef21A1C05", // 43
  "0x89c1D413758F8339Ade263E6e6bC072F1d429f32", // 44
  "0x61bBB5135b43F03C96570616d6d3f607b7103111", // 45
  "0x8C4cE7a10A4e38EE96feD47C628Be1FfA57Ab96e", // 46
  "0x25c1230C7EFC00cFd2fcAA3a44f30948853824bc", // 47
  "0x709F7Ae06Fe93be48FbB90FFDDd69e2746FA8506", // 48
  "0xc0514C03D097fCbB77a74B4DA5b594bA473b6CE1", // 49
];

const INDIAN_NAMES = [
  "Aarav Patel",
  "Vivaan Singh",
  "Aditya Sharma",
  "Vihaan Gupta",
  "Arjun Mishra",
  "Sai Kumar",
  "Reyansh Reddy",
  "Ishaan Malhotra",
  "Shaurya Jain",
  "Atharv Agarwal",
  "Neha Verma",
  "Diya Chatterjee",
  "Ananya Das",
  "Pari Kaur",
  "Riya Mehta",
  "Saanvi Roy",
  "Aadhya Saxena",
  "Myra Iyer",
  "Kiara Bhatt",
  "Prisha Kapoor",
  "Rohan Desai",
  "Vikram Choudhury",
  "Nikhil Joshi",
  "Karan Singh",
  "Rahul Khanna",
  "Siddharth Menon",
  "Abhishek Dubey",
  "Manish Tiwari",
  "Suresh Pillai",
  "Rajesh Gowda",
  "Priya Nair",
  "Sneha Rao",
  "Pooja Hegde",
  "Anjali Dhar",
  "Kavita Krishnamurthy",
  "Meera Rajput",
  "Naina Lal",
  "Sunita Williams",
  "Indra Nooyi",
  "Chanda Kochhar",
  "Sundar Pichai",
  "Satya Nadella",
  "Shantanu Narayen",
  "Arvind Krishna",
  "Ajay Banga",
  "Ratan Tata",
  "Mukesh Ambani",
  "Gautam Adani",
  "Azim Premji",
  "Shiv Nadar",
];

const INSTITUTE_NAMES = [
  "Indian Institute of Technology Bombay",
  "Indian Institute of Science Bangalore",
  "Indian Institute of Technology Delhi",
  "Indian Institute of Technology Madras",
  "Indian Institute of Technology Kharagpur",
  "Indian Institute of Technology Kanpur",
  "Indian Institute of Technology Roorkee",
  "Indian Institute of Technology Guwahati",
  "National Institute of Technology Trichy",
  "National Institute of Technology Warangal",
  "Indian Institute of Management Ahmedabad",
  "Indian Institute of Management Bangalore",
  "Indian Institute of Management Calcutta",
  "Indian Institute of Management Lucknow",
  "All India Institute of Medical Sciences",
  "Jawaharlal Nehru University",
  "Banaras Hindu University",
  "University of Delhi",
  "University of Mumbai",
  "University of Calcutta",
  "Anna University",
  "Jadavpur University",
  "Vellore Institute of Technology",
  "Manipal Academy of Higher Education",
  "Birla Institute of Technology and Science Pilani",
  "Amity University",
  "SRM Institute of Science and Technology",
  "Symbiosis International",
  "Thapar Institute of Engineering and Technology",
  "Jamia Millia Islamia",
  "Aligarh Muslim University",
  "Panjab University",
  "Osmania University",
  "Coursera",
  "Udemy",
  "edX",
  "Udacity",
  "Khan Academy",
  "Pluralsight",
  "Codecademy",
  "Simplilearn",
  "UpGrad",
  "Great Learning",
  "Byju's",
  "Unacademy",
  "Physics Wallah",
  "Stanford University",
  "Harvard University",
  "Massachusetts Institute of Technology",
  "University of Oxford",
];

const COMPANY_NAMES = [
  "Tata Consultancy Services",
  "Infosys",
  "Wipro",
  "HCL Technologies",
  "Tech Mahindra",
  "Reliance Industries",
  "Larsen & Toubro",
  "Adani Enterprises",
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Bajaj Finance",
  "Bharti Airtel",
  "Asian Paints",
  "ITC Limited",
  "Maruti Suzuki",
  "Hindustan Unilever",
  "Sun Pharmaceutical",
  "JSW Steel",
  "NTPC Limited",
  "Power Grid Corporation",
  "Coal India",
  "Indian Oil Corporation",
  "Bharat Petroleum",
  "Oil and Natural Gas Corporation",
  "Tata Steel",
  "Mahindra & Mahindra",
  "Titan Company",
  "Nestle India",
  "Godrej Consumer Products",
  "Britannia Industries",
  "Dabur India",
  "Pidilite Industries",
  "Siemens India",
  "ABB India",
  "Bosch",
  "Oracle Financial Services",
  "LTIMindtree",
  "Flipkart",
  "Amazon India",
  "Google India",
  "Microsoft India",
  "Adobe India",
  "Paytm",
  "Zomato",
  "Swiggy",
  "Ola Cabs",
  "Nykaa",
];

// --- API HELPER ---
const registerUser = async (payload, index) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(
        `✅ [${index}] Registered: ${payload.name} (${payload.role})`
      );
      return true;
    } else {
      console.error(
        `❌ [${index}] Failed: ${payload.name} - ${
          data.message || "Unknown Error"
        }`
      );
      return false;
    }
  } catch (error) {
    console.error(
      `❌ [${index}] Network Error for ${payload.email}:`,
      error.message
    );
    return false;
  }
};

const runSeeder = async () => {
  console.log(`🚀 Starting API Seeder... Target: ${API_BASE_URL}`);

  const payloads = [];

  // --- Distribute Wallets ---
  const adminWallet = PREDEFINED_WALLETS[0];
  const studentWallets = PREDEFINED_WALLETS.slice(1, 17);
  const employerWallets = PREDEFINED_WALLETS.slice(17, 33);
  const instituteWallets = PREDEFINED_WALLETS.slice(33);

  let nameIndex = 0;
  let companyIndex = 0;
  let instituteIndex = 0;

  // 1. Prepare Admin Payload
  payloads.push({
    name: INDIAN_NAMES[nameIndex++],
    email: "admin1@gmail.com",
    password: DEFAULT_PASSWORD,
    role: "admin",
    walletAddress: adminWallet,
  });

  // 2. Prepare Student Payloads
  studentWallets.forEach((wallet, i) => {
    payloads.push({
      name: INDIAN_NAMES[nameIndex++],
      email: `student${i + 1}@demo.com`,
      password: DEFAULT_PASSWORD,
      role: "student",
      walletAddress: wallet,
    });
  });

  // 3. Prepare Employer Payloads
  employerWallets.forEach((wallet, i) => {
    payloads.push({
      name: INDIAN_NAMES[nameIndex++], // HR Name
      email: `employer${i + 1}@demo.com`,
      password: DEFAULT_PASSWORD,
      role: "employer",
      walletAddress: wallet,
      companyName: COMPANY_NAMES[companyIndex++], // API expects 'companyName' at root
    });
  });

  // 4. Prepare Institute Payloads
  instituteWallets.forEach((wallet, i) => {
    payloads.push({
      name: INSTITUTE_NAMES[instituteIndex++],
      email: `institute${i + 1}@demo.com`,
      password: DEFAULT_PASSWORD,
      role: "institute",
      walletAddress: wallet,
    });
  });

  console.log(
    `📋 Prepared ${payloads.length} users. Sending requests sequentially...`
  );

  // --- Execute Requests ---
  let successCount = 0;
  for (let i = 0; i < payloads.length; i++) {
    const success = await registerUser(payloads[i], i + 1);
    if (success) successCount++;
    // Small delay to prevent overwhelming the server or hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n--- Seeding Summary ---");
  console.log(`Total Attempts: ${payloads.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${payloads.length - successCount}`);
  console.log("👋 Done.");
};

runSeeder();
