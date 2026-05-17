import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Seed Demo User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Demo Prime User",
      hashedPassword,
    },
  });
  console.log(`Created demo user: ${demoUser.email} (password: password123)`);

  // Flash deal end time (24 hours from now)
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 24);

  // 2. Seed Products
  const productsData = [
    {
      title: "Quantum Sound Pro Studio Headphones",
      description: "Experience audiophile-grade wireless acoustics with dual active noise cancellation drivers, 50-hour battery life, and custom lossless codec support.",
      price: 299.99,
      originalPrice: 379.99,
      category: "Audio",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Drivers: "40mm Dynamic", ANC: "Hybrid Active", Battery: "50 Hours", Connectivity: "Bluetooth 5.3 / 3.5mm" }),
      stock: 15,
      isFlashDeal: true,
      dealEndsAt: tomorrow,
      rating: 4.9,
      reviewCount: 128,
    },
    {
      title: "NovaVision Ultra 4K Curved Gaming Monitor",
      description: "Immersive 34-inch ultrawide 175Hz OLED panel with 0.03ms response time, HDR1000 peak brightness, and NVIDIA G-Sync compatibility.",
      price: 899.99,
      originalPrice: 1099.99,
      category: "Displays",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Size: "34 inch Ultrawide", Resolution: "3440 x 1440", RefreshRate: "175Hz", Panel: "Quantum OLED" }),
      stock: 6,
      isFlashDeal: true,
      dealEndsAt: tomorrow,
      rating: 4.8,
      reviewCount: 64,
    },
    {
      title: "AeroMech Tactile Wireless Mechanical Keyboard",
      description: "Compact 75% layout with hot-swappable custom lubricated switches, RGB per-key backlighting, aluminum chassis, and tri-mode connectivity.",
      price: 159.99,
      originalPrice: null,
      category: "Computing",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Layout: "75% (84 Keys)", Switches: "Linear Gateron Red", Keycaps: "PBT Dye-Sub", Battery: "4000mAh" }),
      stock: 25,
      isFlashDeal: false,
      dealEndsAt: null,
      rating: 4.7,
      reviewCount: 92,
    },
    {
      title: "ChronoPulse Titan Titanium Smartwatch",
      description: "Rugged multi-sport smartwatch with sapphire crystal display, dual-frequency GPS, ECG tracking, and 14-day continuous battery life.",
      price: 449.99,
      originalPrice: 499.99,
      category: "Wearables",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Body: "Grade 5 Titanium", Glass: "Sapphire Crystal", Waterproof: "10 ATM", Sensors: "ECG, SpO2, GPS" }),
      stock: 12,
      isFlashDeal: false,
      dealEndsAt: null,
      rating: 4.9,
      reviewCount: 210,
    },
    {
      title: "MagnaCharge 100W GaN Super Station",
      description: "Compact 4-port desktop charger powered by Gallium Nitride technology. Fast charge two MacBooks simultaneously with intelligent power allocation.",
      price: 79.99,
      originalPrice: 119.99,
      category: "Power",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Output: "100W Max", Ports: "3x USB-C, 1x USB-A", Technology: "GaN Fast Charge", Protection: "Over-current, Surge" }),
      stock: 40,
      isFlashDeal: true,
      dealEndsAt: tomorrow,
      rating: 4.6,
      reviewCount: 45,
    },
    {
      title: "EchoBeam Smart Spatial Audio Speaker",
      description: "High-fidelity home speaker with real-time room calibration, 360-degree spatial soundstage, and built-in voice assistant privacy toggles.",
      price: 199.99,
      originalPrice: 249.99,
      category: "Smart Home",
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Audio: "360 Spatial Sound", Mics: "4-Mic Array with Mute", Connectivity: "WiFi 6, AirPlay 2, BT 5.2" }),
      stock: 18,
      isFlashDeal: false,
      dealEndsAt: null,
      rating: 4.7,
      reviewCount: 81,
    },
    {
      title: "VortexFlow Ultra-Light Wireless Gaming Mouse",
      description: "Featherweight 54-gram ergonomic design with 30,000 DPI optical sensor, optical switches, and virgin-grade PTFE glide feet.",
      price: 129.99,
      originalPrice: null,
      category: "Computing",
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Weight: "54g", Sensor: "PAW3395 (30k DPI)", PollingRate: "4000Hz Wireless", Battery: "80 Hours" }),
      stock: 30,
      isFlashDeal: false,
      dealEndsAt: null,
      rating: 4.8,
      reviewCount: 154,
    },
    {
      title: "Solaris Pro Foldable Solar Power Bank",
      description: "25,000mAh outdoor power bank with 4 integrated high-efficiency monocrystalline solar panels, dual USB-C PD outputs, and emergency LED floodlight.",
      price: 89.99,
      originalPrice: null,
      category: "Power",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Capacity: "25,000 mAh", SolarOutput: "6W Peak", Ports: "2x USB-C PD 20W, 1x USB-A", Rating: "IP67 Waterproof" }),
      stock: 22,
      isFlashDeal: false,
      dealEndsAt: null,
      rating: 4.5,
      reviewCount: 38,
    },
    {
      title: "HyperDrive NVMe Thunderbolt 4 Enclosure",
      description: "Toolless solid aluminum M.2 SSD enclosure supporting up to 40Gbps transfer speeds. Includes thermal silicone pads for extreme heat dissipation.",
      price: 119.99,
      originalPrice: 149.99,
      category: "Computing",
      image: "https://images.unsplash.com/photo-1597838816882-4435b1977fbe?auto=format&fit=crop&w=1000&q=80",
      specs: JSON.stringify({ Interface: "Thunderbolt 4 / USB4", Speed: "Up to 3000MB/s", Material: "CNC Anodized Aluminum", Compatibility: "M.2 NVMe 2280" }),
      stock: 14,
      isFlashDeal: false,
      dealEndsAt: null,
      rating: 4.9,
      reviewCount: 57,
    },
  ];

  for (const item of productsData) {
    const product = await prisma.product.create({
      data: item,
    });
    console.log(`Created product: ${product.title}`);

    // Create 2 initial reviews for each product
    await prisma.review.createMany({
      data: [
        {
          rating: 5,
          comment: "Absolutely phenomenal build quality and performance. Worth every penny!",
          userId: demoUser.id,
          productId: product.id,
        },
        {
          rating: 4,
          comment: "Solid gadget, works exactly as advertised. Fast delivery too.",
          userId: demoUser.id,
          productId: product.id,
        },
      ],
    });
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
