export const ALL_GPUS = {
  nvidia: [
    "RTX 4090 24GB", "RTX 4080 Super 16GB", "RTX 4080 16GB", "RTX 4070 Ti Super 16GB", "RTX 4070 Ti 12GB", "RTX 4070 Super 12GB", "RTX 4070 12GB", "RTX 4060 Ti 16GB", "RTX 4060 Ti 8GB", "RTX 4060 8GB",
    "RTX 3090 Ti 24GB", "RTX 3090 24GB", "RTX 3080 Ti 12GB", "RTX 3080 12GB", "RTX 3080 10GB", "RTX 3070 Ti 8GB", "RTX 3070 8GB", "RTX 3060 Ti 8GB", "RTX 3060 12GB", "RTX 3050 8GB",
    "RTX 2080 Ti 11GB", "RTX 2080 Super 8GB", "RTX 2080 8GB", "RTX 2070 Super 8GB", "RTX 2070 8GB", "RTX 2060 Super 8GB", "RTX 2060 12GB", "RTX 2060 6GB",
    "GTX 1660 Ti 6GB", "GTX 1660 Super 6GB", "GTX 1660 6GB", "GTX 1650 Super 4GB", "GTX 1650 4GB",
    "GTX 1080 Ti 11GB", "GTX 1080 8GB", "GTX 1070 Ti 8GB", "GTX 1070 8GB", "GTX 1060 6GB", "GTX 1060 3GB", "GTX 1050 Ti 4GB", "GTX 1050 2GB",
    "GTX 980 Ti 6GB", "GTX 980 4GB", "GTX 970 4GB", "GTX 960 2GB"
  ],
  amd: [
    "RX 7900 XTX 24GB", "RX 7900 XT 20GB", "RX 7900 GRE 16GB", "RX 7800 XT 16GB", "RX 7700 XT 12GB", "RX 7600 XT 16GB", "RX 7600 8GB",
    "RX 6950 XT 16GB", "RX 6900 XT 16GB", "RX 6800 XT 16GB", "RX 6800 16GB", "RX 6750 XT 12GB", "RX 6700 XT 12GB", "RX 6700 10GB", "RX 6650 XT 8GB", "RX 6600 XT 8GB", "RX 6600 8GB", "RX 6500 XT 4GB",
    "RX 6400 4GB",
    "RX 5700 XT 8GB", "RX 5700 8GB", "RX 5600 XT 6GB", "RX 5600 6GB", "RX 5500 XT 8GB", "RX 5500 XT 4GB",
    "Radeon VII 16GB", "RX Vega 64 8GB", "RX Vega 56 8GB",
    "RX 590 8GB", "RX 580 8GB", "RX 570 8GB", "RX 570 4GB", "RX 560 4GB", "RX 480 8GB", "RX 470 4GB"
  ],
  intel: [
    "Arc A770 16GB", "Arc A770 8GB", "Arc A750 8GB", "Arc A580 8GB", "Arc A380 6GB", "Arc A310 4GB"
  ]
};

export const ALL_CPUS = {
  amd: [
    "Ryzen 9 9950X (16C/32T)", "Ryzen 9 9900X (12C/24T)", "Ryzen 7 9700X (8C/16T)", "Ryzen 5 9600X (6C/12T)",
    "Ryzen 9 7950X3D (16C/32T)", "Ryzen 9 7950X (16C/32T)", "Ryzen 9 7900X3D (12C/24T)", "Ryzen 9 7900X (12C/24T)", "Ryzen 7 7800X3D (8C/16T)", "Ryzen 7 7700X (8C/16T)", "Ryzen 7 7700 (8C/16T)", "Ryzen 5 7600X (6C/12T)", "Ryzen 5 7600 (6C/12T)", "Ryzen 5 7500F (6C/12T)",
    "Ryzen 9 5950X (16C/32T)", "Ryzen 9 5900X (12C/24T)", "Ryzen 7 5800X3D (8C/16T)", "Ryzen 7 5800X (8C/16T)", "Ryzen 7 5700X3D (8C/16T)", "Ryzen 7 5700X (8C/16T)", "Ryzen 7 5700G (8C/16T)", "Ryzen 5 5600X3D (6C/12T)", "Ryzen 5 5600X (6C/12T)", "Ryzen 5 5600 (6C/12T)", "Ryzen 5 5600G (6C/12T)", "Ryzen 5 5500 (6C/12T)", "Ryzen 5 4500 (6C/12T)",
    "Ryzen 9 3950X (16C/32T)", "Ryzen 9 3900X (12C/24T)", "Ryzen 7 3800X (8C/16T)", "Ryzen 7 3700X (8C/16T)", "Ryzen 5 3600X (6C/12T)", "Ryzen 5 3600 (6C/12T)",
    "Ryzen 7 2700X (8C/16T)", "Ryzen 7 2700 (8C/16T)", "Ryzen 5 2600X (6C/12T)", "Ryzen 5 2600 (6C/12T)",
    "Ryzen 7 1800X (8C/16T)", "Ryzen 7 1700X (8C/16T)", "Ryzen 7 1700 (8C/16T)", "Ryzen 5 1600X (6C/12T)", "Ryzen 5 1600 (6C/12T)"
  ],
  intel: [
    "Core Ultra 9 285K (24C/24T)", "Core Ultra 7 265K (20C/20T)", "Core Ultra 5 245K (14C/14T)",
    "Core i9-14900KS (24C/32T)", "Core i9-14900K (24C/32T)", "Core i9-14900F (24C/32T)", "Core i7-14700K (20C/28T)", "Core i7-14700F (20C/28T)", "Core i5-14600K (14C/20T)", "Core i5-14600F (14C/20T)", "Core i5-14500 (14C/20T)", "Core i5-14400F (10C/16T)",
    "Core i9-13900KS (24C/32T)", "Core i9-13900K (24C/32T)", "Core i9-13900F (24C/32T)", "Core i7-13700K (16C/24T)", "Core i7-13700F (16C/24T)", "Core i5-13600K (14C/20T)", "Core i5-13600F (14C/20T)", "Core i5-13500 (14C/20T)", "Core i5-13400F (10C/16T)",
    "Core i9-12900KS (16C/24T)", "Core i9-12900K (16C/24T)", "Core i9-12900F (16C/24T)", "Core i7-12700K (12C/20T)", "Core i7-12700F (12C/20T)", "Core i5-12600K (10C/16T)", "Core i5-12600F (10C/16T)", "Core i5-12400F (6C/12T)",
    "Core i9-11900K (8C/16T)", "Core i7-11700K (8C/16T)", "Core i5-11600K (6C/12T)", "Core i5-11400F (6C/12T)",
    "Core i9-10900K (10C/20T)", "Core i7-10700K (8C/16T)", "Core i5-10600K (6C/12T)", "Core i5-10400F (6C/12T)",
    "Core i9-9900K (8C/16T)", "Core i7-9700K (8C/8T)", "Core i5-9600K (6C/6T)", "Core i5-9400F (6C/6T)",
    "Core i7-8700K (6C/12T)", "Core i5-8600K (6C/6T)", "Core i5-8400 (6C/6T)"
  ]
};