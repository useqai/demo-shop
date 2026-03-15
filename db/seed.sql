-- DemoShop Seed Data
-- Run this in Supabase SQL Editor after schema.sql

insert into products (name, description, picture, price_usd, categories) values
(
  'Vintage Typewriter',
  'A beautiful mechanical typewriter from the 1960s. Perfect for writers who appreciate the tactile experience of analog writing.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  149.99,
  ARRAY['vintage', 'office', 'collectibles']
),
(
  'Leather Messenger Bag',
  'Full-grain leather messenger bag with brass hardware. Fits 15" laptops. Ages beautifully with everyday use.',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
  219.00,
  ARRAY['bags', 'accessories', 'leather']
),
(
  'Ceramic Pour-Over Set',
  'Hand-thrown ceramic dripper and carafe for the discerning coffee enthusiast. Makes 2–4 cups.',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
  68.00,
  ARRAY['kitchen', 'coffee', 'ceramics']
),
(
  'Noise-Cancelling Headphones',
  'Premium over-ear headphones with 30-hour battery life, adaptive noise cancellation, and studio-quality audio.',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  299.99,
  ARRAY['electronics', 'audio', 'travel']
),
(
  'Merino Wool Beanie',
  'Ultra-soft 100% merino wool beanie. Warm without bulk. One size fits most. Available in charcoal.',
  'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600',
  42.00,
  ARRAY['clothing', 'accessories', 'winter']
),
(
  'Bamboo Cutting Board',
  'Large end-grain bamboo cutting board with juice groove. Naturally antimicrobial and gentle on knife edges.',
  'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600',
  54.95,
  ARRAY['kitchen', 'cooking', 'eco']
),
(
  'Mechanical Keyboard',
  'Compact 75% layout mechanical keyboard with Cherry MX Brown switches. USB-C, PBT keycaps, RGB backlight.',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
  189.00,
  ARRAY['electronics', 'office', 'gaming']
),
(
  'Brass Desk Lamp',
  'Articulated brass desk lamp with Edison bulb. Three-way dimmer switch. Adds warmth to any workspace.',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
  124.00,
  ARRAY['home', 'office', 'lighting']
),
(
  'Hardcover Notebook',
  'A5 hardcover notebook, 240 pages of 100gsm acid-free paper. Lay-flat binding, bookmark ribbon.',
  'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
  28.00,
  ARRAY['stationery', 'office', 'writing']
),
(
  'Cast Iron Skillet',
  'Pre-seasoned 10-inch cast iron skillet. Oven-safe to 500°F. Perfect sear on steaks, cornbread, and more.',
  'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=600',
  49.95,
  ARRAY['kitchen', 'cooking', 'cast-iron']
);
