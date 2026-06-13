package com.plus33.europe.global.config;

import com.plus33.europe.local.model.Product;
import com.plus33.europe.global.model.JournalStory;
import com.plus33.europe.local.repository.ProductRepository;
import com.plus33.europe.global.repository.JournalStoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final ProductRepository productRepository;
    private final JournalStoryRepository journalStoryRepository;

    public DatabaseSeeder(ProductRepository productRepository, JournalStoryRepository journalStoryRepository) {
        this.productRepository = productRepository;
        this.journalStoryRepository = journalStoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedProducts();
        seedJournalStories();
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            logger.info("Product database is empty. Seeding 27 signature selections...");

            Product[] initialProducts = {
                new Product(
                    "Café Filtre",
                    "A traditional hand-poured filter drip bag highlighting clean single-origin nuances. Slow-brewed for exceptional cup clarity and complex red currant acidity.",
                    6.00, "hot-coffee", "Kenya Nyeri Wash-Lot", "Light",
                    "Filter Drip, Wash-Lot, Red Currant",
                    "/local/assets/products/drinks/hot-coffee/cafe-filtre.png", "Single Origin"
                ),
                new Product(
                    "Cappuccino",
                    "Expertly steamed milk poured over a rich double espresso base, creating a thick, luxurious blanket of velvety microfoam. Perfectly finished with hand-crafted latte art.",
                    6.50, "hot-coffee", "Organic Blend · In-Salon", "Rich & Velvety",
                    "Silky Milk, Double Espresso, Latte Art",
                    "/local/assets/products/drinks/hot-coffee/cappuccino.png", "Best Seller"
                ),
                new Product(
                    "Latte / Flat White",
                    "Your choice between our smooth, milk-forward Caffè Latte or the bolder, velvety Flat White crafted with ristretto extraction and micro-textured steamed milk.",
                    6.80, "hot-coffee", "Brazilian Cerrado · In-Salon", "Smooth & Creamy",
                    "Steamed Milk, Ristretto, Velvety",
                    "/local/assets/products/drinks/hot-coffee/latte-flat-white.jpg", "Atelier Standard"
                ),
                new Product(
                    "Chai Latte",
                    "An elegant infusion of slow-brewed black tea leaves, crushed cardamoms, cinnamon bark, and wild ginger, finished with lightly textured organic oat milk.",
                    7.00, "hot-coffee", "Nilgiri Tea & Spices", "Aromatic & Spiced",
                    "Masala Spices, Oat Milk, Aromatic",
                    "/local/assets/products/drinks/hot-coffee/chai-latte.png", "House Specialty"
                ),
                new Product(
                    "Pumpkin Latte",
                    "A refined autumnal luxury. Double shot of specialty espresso combined with slow-simmered pumpkin coulis, warm winter spices, and real Madagascar vanilla.",
                    7.50, "hot-coffee", "Atelier Blend · In-Salon", "Warm & Comforting",
                    "Pumpkin Coulis, Nutmeg, Vanilla Bean",
                    "/local/assets/products/drinks/hot-coffee/pumpkin-latte.jpg", "Autumn Special"
                ),
                new Product(
                    "Matcha",
                    "Stone-ground spring tencha leaves from Uji, Kyoto. Traditional bamboo-whisked preparation delivering a vibrant emerald green color and a smooth, mellow umami profile.",
                    7.20, "hot-coffee", "Uji, Kyoto, Japan", "Spring First-Harvest",
                    "Kyoto Origin, Umami, Emerald Green",
                    "/local/assets/products/drinks/matcha.jpeg", "Ceremonial Grade"
                ),
                new Product(
                    "Matcha Vanille",
                    "A luxurious layered creation pairing whisked Ceremonial Uji Matcha with organic Madagascar vanilla bean nectar and chilled velvet milk.",
                    7.50, "iced-coffee", "Kyoto & Madagascar", "Velvet Layers",
                    "Vanilla Nectar, Ceremonial Uji, Layered",
                    "/local/assets/products/drinks/iced-coffee/matcha-vanille.jpg", "Pastry Lab Blend"
                ),
                new Product(
                    "Thé Glacé d'Hiver",
                    "\"Winter Iced Tea\" — A delicate, 12-hour cold-steeped botanical infusion featuring wild forest berries, organic elderflower, citrus peels, and a dash of winter spice.",
                    7.00, "iced-coffee", "Provence Blend · Cold Infused", "Floral & Fruity",
                    "Cold Steeped, Forest Berries, Elderflower",
                    "/local/assets/products/drinks/iced-coffee/the-glace-dhiver.png", "Botanical Brew"
                ),
                new Product(
                    "Tiramisu Glacé",
                    "A dessert in a glass. Layers of chilled double espresso, sweet whipped mascarpone cream, house-baked savoiardi crumbs, and a dusting of dark French cocoa powder.",
                    8.50, "iced-coffee,desserts", "Plus33 Pastry Lab", "Rich & Decadent",
                    "Mascarpone, Savoiardi, Cocoa Dust",
                    "/local/assets/products/desserts/tiramisu-glace.jpg", "Seasonal Dessert"
                ),
                new Product(
                    "Iced Punch Coco",
                    "An ultra-refreshing Parisian-tropical fusion. Chilled organic coconut water, whipped sweet coconut cream, and a splash of lime juice poured over crystal ice spheres.",
                    8.00, "iced-coffee", "Tropical Sourced · Iced", "Sweet & Hydrating",
                    "Coconut Water, Sweet Cream, Lime Splash",
                    "/local/assets/products/drinks/iced-coffee/iced-punch-coco.jpg", "Exotic Reserve"
                ),
                new Product(
                    "Sachet de Café",
                    "Our signature luxury whole bean coffee pouch. Hand-packaged and nitrogen-flushed in Paris to guarantee peak aroma, featuring sweet notes of jasmine, bergamot, and honey. 250g.",
                    24.00, "retail,signature", "Ethiopia Yirgacheffe & Geisha", "Light-Medium Blend",
                    "Whole Bean, Geisha Blend, Paris Sourced",
                    "/local/assets/products/retail/sachet-de-cafe.png", "Micro-Lot Pouch"
                ),
                new Product(
                    "Cerrado & Colombia",
                    "A signature house blend balancing sweet Brazilian Cerrado with vibrant Colombian Huila beans. Hand-packaged to offer a rich milk chocolate body with toasted hazelnut aromas.",
                    22.00, "retail", "Cerrado & Huila Regions", "Medium Roast",
                    "Whole Bean, Smooth Body, Caramel Finish",
                    "/local/assets/products/retail/cerrado-colombia.jpg", "House Reserve"
                ),
                new Product(
                    "Signature Dark Roast",
                    "A bold, deep espresso blend roasted slightly longer to express rich dark cacao notes, heavy-bodied texture, and a smooth, bittersweet smoky caramel finish.",
                    21.00, "retail,signature", "Central & South America", "Dark Roast",
                    "Whole Bean, Dark Cacao, Bold Body",
                    "/local/assets/products/retail/signature-dark-roast.png", "Intense Selection"
                ),
                new Product(
                    "+33 Atelier Gift Pack",
                    "The ultimate sensory coffee gift. Beautifully boxed collection including two of our micro-lot single-origin filter bags, one whole bean reserve pouch, and custom brand cards.",
                    63.30, "merchandise,signature", "Curated Selection", "Multi-Roast Edition",
                    "Gift Box, Curated Reserve, Handcrafted",
                    "/local/assets/products/merchandise/atelier-gift-pack.jpeg", "Luxury Set"
                ),
                new Product(
                    "+33 Organic Tote",
                    "Heavyweight organic cotton canvas tote featuring our hand-pressed signature wordmark. Durable, elegant, and designed to carry your daily coffee ritual essentials.",
                    18.00, "merchandise,signature", "Parisian Atelier", "Cotton Canvas",
                    "Organic Cotton, French Design, Everyday Carry",
                    "/local/assets/products/merchandise/organic-tote.png", "Ritual Object"
                ),
                new Product(
                    "Almond Croissant",
                    "Our classic croissant filled with rich almond frangipane cream, topped with sliced toasted almonds and a light dusting of powdered sugar.",
                    5.20, "desserts", "Plus33 Pastry Lab", "Toasted & Sweet",
                    "Almond Frangipane, Toasted Almonds, Sweet",
                    "/local/assets/products/desserts/ALMOND CROISSANT.jpg", "Fresh Daily"
                ),
                new Product(
                    "Pain au Chocolat",
                    "A traditional French chocolate pastry crafted with layered puff pastry and filled with premium dark chocolate batons from Valrhona.",
                    4.80, "desserts", "Plus33 Pastry Lab", "Buttery & Chocolatey",
                    "Valrhona Chocolate, Puff Pastry, Classic French",
                    "/local/assets/products/desserts_category.jpg", "Best Seller"
                ),
                new Product(
                    "Croissant",
                    "A classic, golden French pastry with a flaky, buttery texture and crisp exterior, baked to perfection.",
                    4.50, "desserts", "Plus33 Pastry Lab", "Warm & Buttery",
                    "Normandy Butter, Flaky Layers, Classic French",
                    "/local/assets/products/desserts/croissant.jpg", "Pastry Lab Selection"
                ),
                new Product(
                    "Donut",
                    "An artisanal glazed donut, soft and fluffy inside, topped with a delicate sweet glaze.",
                    3.80, "desserts", "Plus33 Pastry Lab", "Sweet & Soft",
                    "Artisanal Glaze, Soft Dough, Freshly Made",
                    "/local/assets/products/desserts/donut.jpg", "Sweet Treat"
                ),
                new Product(
                    "Pretzel",
                    "A classic German-style soft pretzel, golden brown and sprinkled with coarse sea salt.",
                    4.20, "desserts", "Plus33 Pastry Lab", "Salty & Chewy",
                    "Sea Salt, Baked Fresh, Traditional Style",
                    "/local/assets/products/desserts/pretzel.jpg", "Atelier Baked"
                ),
                new Product(
                    "Éclair au Chocolat",
                    "Classic French pastry made with light choux dough, filled with rich chocolate pastry cream, and finished with a glossy dark chocolate glaze.",
                    5.50, "desserts", "Plus33 Pastry Lab", "Choux & Chocolate",
                    "Choux Pastry, Valrhona Cocoa, Parisian Classic",
                    "/local/assets/products/desserts/Éclairs.png", "Atelier Classic"
                ),
                new Product(
                    "Artisanal Gelato",
                    "House-churned Italian-style gelato made with fresh organic milk, organic Madagascar vanilla beans, and a smooth, creamy texture.",
                    6.20, "desserts", "Plus33 Pastry Lab", "Cool & Creamy",
                    "Madagascar Vanilla, Organic Milk, House Churned",
                    "/local/assets/products/desserts/Gelato.png", "Summer Special"
                ),
                new Product(
                    "Tiramisu Glacé",
                    "An elevated frozen expression of the classic Italian dessert, featuring espresso-soaked ladyfingers, whipped mascarpone cream, and dusted cocoa.",
                    6.80, "desserts", "Plus33 Pastry Lab", "Espresso & Mascarpone",
                    "Single-Origin Espresso, Mascarpone, Cocoa",
                    "/local/assets/products/desserts/tiramisu-glace.jpg", "Chef's Choice"
                ),
                new Product(
                    "Zefir",
                    "A light, airy, and delicately sweet fruit confection made with organic apple purée, fresh egg whites, and agar-agar, dusted with powdered sugar.",
                    4.50, "desserts", "Plus33 Pastry Lab", "Light & Fruity",
                    "Apple Purée, Meringue Style, Delicate Sweet",
                    "/local/assets/products/desserts/Zefir.png", "Delicate Treat"
                ),
                new Product(
                    "Masala Chai Tea Pouch",
                    "An authentic, aromatic heritage tea blend. Combining premium high-grown Assam black tea leaves with freshly crushed green cardamoms, cinnamon bark, cloves, and wild ginger for a comforting, warming infusion at home.",
                    18.00, "retail", "Assam & Kerala, India", "Spiced Botanical",
                    "Assam Black Tea, Cardamom, Ginger, Warming",
                    "/local/assets/products/retail/Masala Chai Tea Pouch.png", "Heritage Blend"
                ),
                new Product(
                    "Kashmiri Kahwa",
                    "An imperial saffron-infused green tea from the valleys of Kashmir. Delicate green tea leaves hand-blended with premium saffron threads, green cardamom, cinnamon, and slivered sweet almonds for a majestic, fragrant brew.",
                    26.00, "retail", "Kashmir Valley, India", "Saffron Green Tea",
                    "Saffron Threads, Cardamom, Sweet Almonds, Fragrant",
                    "/local/assets/products/retail/Kashmiri Kahwa.jpg", "Imperial Reserve"
                ),
                new Product(
                    "Ooty Gold",
                    "A rare, high-altitude single-origin coffee harvested from the misty slopes of the Nilgiri hills. Hand-picked at 2,200 meters and medium-roasted to express a bright, golden body with complex notes of wild honey, citrus blossom, and toasted hazelnut.",
                    25.00, "retail", "Nilgiri Hills, India", "Medium Roast",
                    "Whole Bean, Wild Honey, Citrus Blossom, Smooth Body",
                    "/local/assets/products/retail/Ooty Gold.jpg", "Single Origin"
                )
            };

            productRepository.saveAll(Arrays.asList(initialProducts));
            logger.info("Products seeded successfully!");
        }
    }

    private void seedJournalStories() {
        if (journalStoryRepository.count() == 0) {
            logger.info("Journal database is empty. Seeding 14 editorial articles...");

            JournalStory[] initialStories = {
                // ── FEATURED ──
                new JournalStory(
                    "The Soil of Ethiopia",
                    "Origins",
                    "May 12, 2024",
                    "/global/journal/assets/soil-ethiopia.png",
                    "In the highlands of Sidamo, coffee grows the way it has for centuries — wild, shaded, unhurried. We traveled to the farms that supply our single-origin reserves to understand what makes Ethiopian terroir irreplaceable.",
                    "8 min read",
                    "A dispatch from the birthplace of coffee",
                    true
                ),
                // ── ORIGINS ──
                new JournalStory(
                    "Altitude and Terroir: Colombia's Hidden Valleys",
                    "Origins",
                    "April 20, 2024",
                    "/global/journal/assets/colombia-terroir.png",
                    "At 1,900 metres above sea level, in the shadow of the Andes, Colombian farmers cultivate beans that carry the taste of volcanic soil, mountain rain, and patience.",
                    "6 min read",
                    "High-altitude coffee and the farmers who grow it",
                    false
                ),
                new JournalStory(
                    "Rwanda at Dawn",
                    "Origins",
                    "March 15, 2024",
                    "/global/journal/assets/rwanda-dawn.png",
                    "The first light over Lake Kivu reveals terraced hillsides of coffee cherries turning from green to deep crimson. Rwanda's specialty coffee revolution is quiet, meticulous, and world-class.",
                    "5 min read",
                    "The quiet revolution of Rwandan specialty coffee",
                    false
                ),
                // ── PROCESS ──
                new JournalStory(
                    "Roast Profiles: A Visual Atlas",
                    "Process",
                    "May 01, 2024",
                    "/global/journal/assets/roast-profiles.png",
                    "Every roast at +33 is profiled individually. Light, medium, dark — these are not choices. They are consequences of listening to the bean. A visual guide to how we approach the irreversible moment.",
                    "7 min read",
                    "How we listen to the bean before the roast",
                    false
                ),
                new JournalStory(
                    "The Science of Extraction",
                    "Process",
                    "February 28, 2024",
                    "/global/journal/assets/science-extraction.png",
                    "Between 18% and 22% lies the extraction sweet spot — the narrow window where flavour compounds dissolve perfectly. Too little, and the cup is sour. Too much, and bitterness takes over.",
                    "6 min read",
                    "Precision brewing and the mathematics of flavour",
                    false
                ),
                // ── LIFESTYLE ──
                new JournalStory(
                    "Morning in the 7ème",
                    "Lifestyle",
                    "May 08, 2024",
                    "/global/journal/assets/morning-7eme.png",
                    "The seventh arrondissement wakes slowly. The first espresso is pulled before the Eiffel Tower catches sunlight. This is our morning ritual — and the city's.",
                    "4 min read",
                    "A Parisian morning through coffee",
                    true
                ),
                new JournalStory(
                    "A Table in Milan",
                    "Lifestyle",
                    "January 18, 2024",
                    "/global/journal/assets/milan-table.png",
                    "Milan taught us that coffee is architecture — brief, precise, and never casual. Standing at the bar of a century-old pasticceria, we understood why Italy never sits down for espresso.",
                    "5 min read",
                    "What Italian coffee culture taught us about brevity",
                    false
                ),
                new JournalStory(
                    "The Slow Hours",
                    "Lifestyle",
                    "December 05, 2023",
                    "/global/journal/assets/slow-hours.png",
                    "Between 2pm and 4pm, the café breathes differently. The lunch rush dissolves. Conversations become quieter. This is the hour we designed +33 for.",
                    "3 min read",
                    "Why the afternoon is our favourite service",
                    false
                ),
                // ── DESIGN ──
                new JournalStory(
                    "The Architecture of Taste",
                    "Design",
                    "April 28, 2024",
                    "/global/journal/assets/architecture-taste.png",
                    "Every +33 atelier begins as a conversation between space and ritual. We don't decorate — we compose. How our design philosophy shapes the way coffee feels.",
                    "7 min read",
                    "Composing spaces where coffee becomes experience",
                    false
                ),
                new JournalStory(
                    "Designing Silence: Our Dubai Atelier",
                    "Design",
                    "March 02, 2024",
                    "/global/journal/assets/dubai-atelier.png",
                    "In a city that never stops, we created a space that asks you to pause. Natural stone, muted light, and the sound of a single espresso machine. Our Dubai atelier is an exercise in restraint.",
                    "6 min read",
                    "Creating calm in the heart of Downtown Dubai",
                    false
                ),
                new JournalStory(
                    "The Object: Our Ceramic Cup",
                    "Design",
                    "November 12, 2023",
                    "/global/journal/assets/ceramic-cup.png",
                    "Heavy. Warm. Intentional. Our signature ceramic cup was developed over 14 months with a Portuguese ceramicist. It weighs exactly 340 grams — because weight is the first thing you notice.",
                    "4 min read",
                    "14 months to create the perfect vessel",
                    false
                ),
                // ── RITUALS ──
                new JournalStory(
                    "The First Pour",
                    "Rituals",
                    "April 10, 2024",
                    "/global/journal/assets/first-pour.png",
                    "The first pour is never about extraction. It's about awakening. The bloom — that brief, volcanic rise of the grounds — tells you everything about freshness, grind, and readiness.",
                    "5 min read",
                    "Understanding the bloom and what it reveals",
                    true
                ),
                new JournalStory(
                    "Why We Never Rush",
                    "Rituals",
                    "February 14, 2024",
                    "/global/journal/assets/never-rush.png",
                    "A hand brew at +33 takes exactly the time it needs. Four minutes. Sometimes five. We will never install a timer that beeps. The barista knows. The cup knows.",
                    "3 min read",
                    "The philosophy of patience in every cup",
                    false
                ),
                new JournalStory(
                    "Sunday Espresso",
                    "Rituals",
                    "January 07, 2024",
                    "/global/journal/assets/sunday-espresso.png",
                    "Sunday is different. The grinder is set slightly coarser. The milk is steamed a fraction longer. Even the music changes. Our Sunday espresso is a weekly ceremony of small adjustments.",
                    "4 min read",
                    "How Sundays change the way we brew",
                    false
                )
            };

            journalStoryRepository.saveAll(Arrays.asList(initialStories));
            logger.info("Journal stories seeded successfully! Total stories count: {}", journalStoryRepository.count());
        } else {
            logger.info("Journal stories database already seeded. Current stories count: {}", journalStoryRepository.count());
        }
    }
}
