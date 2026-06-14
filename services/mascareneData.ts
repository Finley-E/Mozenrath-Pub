import { Numa, NumaClass, EvolutionStage, FoodItem, FoodCategory, Island, VocabWord } from "../types";

// 4 Island details
export const ISLANDS: Island[] = [
  {
    id: "lovi",
    name: "Lovi Canopy",
    motto: "Where life climbs high to meet the currents of old memory.",
    ecosystem: "Lush ancient moss groves, suspended fern bridges, and sweetwater springs fed by high-altitude humidity.",
    architecture: "Woven living-bamboo platform-dwellings suspended between massive Ironwood roots, connected by hanging sky-walks.",
    foodCulture: "Steamed root-starches, wild canopy honey, leaf-wrapped moss rolls, and sweet sap-drippings.",
    festival: "Suna Tave (The Whispering Vine Bond), where locals weave glowing root-fibers into the collars of forest Numa.",
    profession: "Suna Loomers (weavers of memory fiber and trackers of canopy migrations)",
    guardian: "Elder Nulu-Sa",
    pathStoneName: "Lovi Moss Stone",
    difficulty: 1,
  },
  {
    id: "koru",
    name: "Koru Basalt",
    motto: "The glowing hearth where clay is fired and sparks are harbored.",
    ecosystem: "Obsidian terraces, hot-spring calderas, thermal wind shafts, and dark sacred rich iron-ash banks.",
    architecture: "Subterranean ash-domes carved from cool consolidated tuffs, decorated with fired red volcanic lacquer.",
    foodCulture: "Earthen pit-roasted subterranean tubers, spiced sun-dried obsidian berries, and hot spring thermal broths.",
    festival: "Raza Sose (Sparks of Raza Ascent), where fire spark Numa are guided down basalt cliffs in gentle floating lanterns.",
    profession: "Kora Potters (clay-workers who shape the volcanic vessels for Numa companionship)",
    guardian: "Keeper Raza-Ta",
    pathStoneName: "Koru Fire Stone",
    difficulty: 2,
  },
  {
    id: "mase",
    name: "Mase Shallows",
    motto: "Resting upon the blue ripple, where tidal memory washes the sands.",
    ecosystem: "Turquoise lagoons, shallow tidal reefs, glowing blue coral gardens, and highly mineralized salt marshes.",
    architecture: "Lightweight drift-bamboo shelters bound using hand-twisted coconut coir, designed to wave gently with tidal swells.",
    foodCulture: "Sea-vine crisp ribbons, sun-cured lagoon snail crisps, roasted salt-crust sand bulbs, and kelp broth.",
    festival: "Munu Lowi (The Tide-Current Waltz), where divers place glowing pearl-shells along the barrier reef to welcome deep ocean Numa.",
    profession: "Masa Divers (tidal deep-listeners who retrieve sunken clay relics and shell currents)",
    guardian: "Loom-Mother Yo-Ra",
    pathStoneName: "Mase Sound Stone",
    difficulty: 3,
  },
  {
    id: "wesa",
    name: "Wesa High Lands",
    motto: "Riding the cold wave of high sky, watching the stars reflect.",
    ecosystem: "Wind-swept alpine meadows, echoing flute-caves, shear high-altitude plateaus, and cold vapor cliffs.",
    architecture: "Wicker kite-shaped structures suspended from cliff edges, anchored by heavy basalt stones and fitted with wind-flutes.",
    foodCulture: "Whipped cloud-curd dairy, parched high-meadow wind-barley, dried star-plums, and steam-brewed alpine tea.",
    festival: "We Woza (The Great Sky Flight), where weavers construct immense grass kites designed to carry wind-current seeds high into the clouds.",
    profession: "Raza Gliders (weavers of grass-paper gliders who maps wind currents and sky paths)",
    guardian: "Wind-Sage Wera-Lo",
    pathStoneName: "Wesa Gale Stone",
    difficulty: 4,
  }
];

// Proto-Language vocabulary sets
export const VOCABULARY: VocabWord[] = [
  { munuWord: "munu", englishTranslation: "current / island waterborn", exampleSentence: "Munu va numa lo.", englishTranslationDetails: "The current brings the lifeforms to the shelter." } as any,
  { munuWord: "numa", englishTranslation: "memory lifeborn from island tides", exampleSentence: "Numa suna lo.", englishTranslationDetails: "The creature makes a friendly bond." } as any,
  { munuWord: "sanu", englishTranslation: "ledger of records / seed of wisdom", exampleSentence: "Sanu sa we.", englishTranslationDetails: "The wisdom ledger is stable like sky stone." } as any,
  { munuWord: "vala", englishTranslation: "energy shell / glowing currency", exampleSentence: "Vala lo ta.", englishTranslationDetails: "The shells buy baked goods at the hearth." } as any,
  { munuWord: "kora", englishTranslation: "clay vessel for companion bonding", exampleSentence: "Kora ki numa.", englishTranslationDetails: "The gentle vessel contains the juvenile creature." } as any,
  { munuWord: "lu", englishTranslation: "rest center / healing spring meadow", exampleSentence: "Lu numa se.", englishTranslationDetails: "The healing hall makes the creature healthy and quiet." } as any,
  { munuWord: "suna", englishTranslation: "glowing thread / friendly trust", exampleSentence: "Suna munu sa.", englishTranslationDetails: "Our friendship is as enduring as the island's stone current." } as any,
  { munuWord: "lovi", englishTranslation: "canopy leaf / climbing tree", exampleSentence: "Lovi sa numa.", englishTranslationDetails: "The forest tree stabilizes the memory spirits." } as any,
  { munuWord: "kozu", englishTranslation: "hot steam / hearth sparks", exampleSentence: "Kozu ta ra.", englishTranslationDetails: "The volcano pit roasts are primordial heat." } as any,
  { munuWord: "masa", englishTranslation: "salt reef / barrier blue", exampleSentence: "Masa se munu.", englishTranslationDetails: "The salt reef filters the incoming water currents." } as any,
  { munuWord: "wowo", englishTranslation: "flight wind / mountain glider", exampleSentence: "Wowo we se.", englishTranslationDetails: "The glider rides the sky clean and high." } as any,
  { munuWord: "yasa", englishTranslation: "glowing stars / dark night sky", exampleSentence: "Yasa lo numa.", englishTranslationDetails: "The starry night sky comforts the nocturnal lifeforms." } as any,
  { munuWord: "ki", englishTranslation: "small sprout / fresh child", exampleSentence: "Ki lo numa.", englishTranslationDetails: "The juvenile Numa plays in the canopy shelter." } as any,
  { munuWord: "ku", englishTranslation: "strong trunk / mature guide", exampleSentence: "Ku numa ra.", englishTranslationDetails: "The mature companion is strong and primordial." } as any,
  { munuWord: "ma", englishTranslation: "grizzled wood / senior elder", exampleSentence: "Ma numa sa.", englishTranslationDetails: "The elder Numa is full of stone-like wisdom." } as any,
  { munuWord: "ra", englishTranslation: "primordial source / ultimate spirit", exampleSentence: "Wera ra we.", englishTranslationDetails: "Wera is the primordial spirit of the sky heat." } as any,
  { munuWord: "vise", englishTranslation: "handwoven plant basket", exampleSentence: "Vise lo va.", englishTranslationDetails: "The woven basket holds valuable sea shells." } as any,
  { munuWord: "soka", englishTranslation: "clay oven slow-baking", exampleSentence: "Soka ta lo.", englishTranslationDetails: "Oven baking takes place in the earth hearth canopy." } as any,
  { munuWord: "nulu", englishTranslation: "soft wind whisper / Numa singer", exampleSentence: "Nulu se numa.", englishTranslationDetails: "Soft singing calms down the wild spirits." } as any,
  { munuWord: "tave", englishTranslation: "traditional string instrument", exampleSentence: "Tave ri sa.", englishTranslationDetails: "The lute sound resonates off the stone walls." } as any
];

// Complete Food System (90 items: 20 Staples, 20 Foraged, 20 Drinks, 20 Prepared, 10 Festival)
export const FOOD_ITEMS: FoodItem[] = [
  // STAPLES (20 items)
  { id: "stap-01", name: "Munu Rice-grain", category: FoodCategory.STAPLE, originIsland: "Lovi Canopy", description: "Water-grown wild grass grains with a delicate sweet water aroma.", valaValue: 5, effect: "Restores 10 Memory" },
  { id: "stap-02", name: "Soka Sweet Tuber", category: FoodCategory.STAPLE, originIsland: "Koru Basalt", description: "Starchy pink root baked slow in subsurface basalt ash pits.", valaValue: 6, effect: "Restores 12 Memory" },
  { id: "stap-03", name: "Masa Dried Kelp", category: FoodCategory.STAPLE, originIsland: "Mase Shallows", description: "Salty green ribbons dried on rocks, forming the basis of coastal bowls.", valaValue: 4, effect: "Restores 8 Memory" },
  { id: "stap-04", name: "Wesa Wind-Barley", category: FoodCategory.STAPLE, originIsland: "Wesa High Lands", description: "Husked golden kernels that grow in shear high plateaus, ground into meal.", valaValue: 8, effect: "Restores 15 Memory" },
  { id: "stap-05", name: "Lovi Fern-heart", category: FoodCategory.STAPLE, originIsland: "Lovi Canopy", description: "The dense inner pith of the giant tree-ferns; neutral with a forest taste.", valaValue: 7, effect: "Restores 14 Memory" },
  { id: "stap-06", name: "Koru Ash-bulb", category: FoodCategory.STAPLE, originIsland: "Koru Basalt", description: "A dark onion-like root that thrives in high-sulfur mud plains.", valaValue: 8, effect: "Restores 16 Memory" },
  { id: "stap-07", name: "Mase Sand-bean", category: FoodCategory.STAPLE, originIsland: "Mase Shallows", description: "Crunchy gray legumes harvested from dunes, high in salt content.", valaValue: 5, effect: "Restores 10 Memory" },
  { id: "stap-08", name: "Wesa Peak-Oats", category: FoodCategory.STAPLE, originIsland: "Wesa High Lands", description: "Heavy grain heads harvested from frosty cloud meadows.", valaValue: 9, effect: "Restores 18 Memory" },
  { id: "stap-09", name: "Lovi Moss-Lichen", category: FoodCategory.STAPLE, originIsland: "Lovi Canopy", description: "Nutritious gray lichen peeled from ironwood branches, chewy and dense.", valaValue: 5, effect: "Restores 11 Memory" },
  { id: "stap-10", name: "Koru Steam-Nut", category: FoodCategory.STAPLE, originIsland: "Koru Basalt", description: "Hard-shelled nut found near hot geysers, cracked open to find warm buttery flesh.", valaValue: 10, effect: "Increases Attack by 2 for next battle" },
  { id: "stap-11", name: "Mase Coral-stems", category: FoodCategory.STAPLE, originIsland: "Mase Shallows", description: "Edible calcified plant-stalks that mineralize on beach tides.", valaValue: 7, effect: "Increases Defense by 2 for next battle" },
  { id: "stap-12", name: "Wesa High-Rye", category: FoodCategory.STAPLE, originIsland: "Wesa High Lands", description: "Dark cold-hardy rye grain mapped by gliders on windy ledges.", valaValue: 8, effect: "Restores 15 Memory" },
  { id: "stap-13", name: "Lo-se Bread-shoot", category: FoodCategory.STAPLE, originIsland: "Lovi Canopy", description: "Sprouting green shoot that tastes of parched flour, boiled to expand.", valaValue: 6, effect: "Restores 12 Memory" },
  { id: "stap-14", name: "Ta-zui Baked Clay-stalk", category: FoodCategory.STAPLE, originIsland: "Koru Basalt", description: "Mineral-rich root which is encased in hot volcanic mud to steam.", valaValue: 7, effect: "Restores 13 Memory" },
  { id: "stap-15", name: "Vi-se Reed-pith", category: FoodCategory.STAPLE, originIsland: "Mase Shallows", description: "Light sweet core of water reeds, dried and milled into fine baking flour.", valaValue: 6, effect: "Restores 11 Memory" },
  { id: "stap-16", name: "Wo-wo Cloud-pod", category: FoodCategory.STAPLE, originIsland: "Wesa High Lands", description: "Feathery air-filled shell containing several highly oily core seeds.", valaValue: 9, effect: "Restores 20 Memory" },
  { id: "stap-17", name: "Munu Creek-pea", category: FoodCategory.STAPLE, originIsland: "Lovi Canopy", description: "Small blue pea that grows near mountain torrents, high in energy.", valaValue: 5, effect: "Restores 10 Memory" },
  { id: "stap-18", name: "Kozui Red-Rice", category: FoodCategory.STAPLE, originIsland: "Koru Basalt", description: "Flinty reddish wild crop that succeeds only in warm volcano soil.", valaValue: 8, effect: "Restores 17 Memory" },
  { id: "stap-19", name: "Masa Sea-Potato", category: FoodCategory.STAPLE, originIsland: "Mase Shallows", description: "Tidal tuber that grows below the lagoon sand, harvested at low current.", valaValue: 7, effect: "Restores 14 Memory" },
  { id: "stap-20", name: "We Cliff-Cereal", category: FoodCategory.STAPLE, originIsland: "Wesa High Lands", description: "Tough gray grain clustered on sheer rock face, hand-picked by brave gatherers.", valaValue: 10, effect: "Restores 22 Memory" },

  // FORAGED GOODS (20 items)
  { id: "fora-01", name: "Lovi Sweet Honey-droplet", category: FoodCategory.FORAGED, originIsland: "Lovi Canopy", description: "Pure golden canopy honey dripped from hollow ironwood honeycombs.", valaValue: 12, effect: "Increases Companion Bond significantly" },
  { id: "fora-02", name: "Koru Sulphur-berry", category: FoodCategory.FORAGED, originIsland: "Koru Basalt", description: "Tangy bright orange berries growing alongside hot vents, warm to touch.", valaValue: 15, effect: "Fully heals mild Numa fatigue" },
  { id: "fora-03", name: "Mase Lagoon-snail", category: FoodCategory.FORAGED, originIsland: "Mase Shallows", description: "Spiral tidal snail harvested from shallow reef pools at low tide.", valaValue: 10, effect: "Increases Numa Defense (+3)" },
  { id: "fora-04", name: "Wesa Star-plum", category: FoodCategory.FORAGED, originIsland: "Wesa High Lands", description: "Deep midnight purple fruit with starry patterns on the skin, frosty taste.", valaValue: 14, effect: "Increases Numa Current Attack (+3)" },
  { id: "fora-05", name: "Lovi Canopy Orchid-seed", category: FoodCategory.FORAGED, originIsland: "Lovi Canopy", description: "Furry seed gathered from vanilla-scented platform flowers.", valaValue: 11, effect: "Restores 15 Resonance" },
  { id: "fora-06", name: "Koru Red-clay Lump", category: FoodCategory.FORAGED, originIsland: "Koru Basalt", description: "Fine malleable volcanic clay rich in minerals, loved by rock-clinging Numa.", valaValue: 11, effect: "Increases Volcano Numa Bond (+10)" },
  { id: "fora-07", name: "Mase Blue Pearl-shell", category: FoodCategory.FORAGED, originIsland: "Mase Shallows", description: "Iridescent split clam shell, highly prized by local collectors and merchants.", valaValue: 20, effect: "Can be sold for many Vala" },
  { id: "fora-08", name: "Wesa Mountain Grass-stalk", category: FoodCategory.FORAGED, originIsland: "Wesa High Lands", description: "Sweet grass that whistle when the breeze passes; favorite of wind companions.", valaValue: 10, effect: "Increases Wind Numa Bond (+10)" },
  { id: "fora-09", name: "Lovi Rain-mushroom", category: FoodCategory.FORAGED, originIsland: "Lovi Canopy", description: "Glowing turquoise fungus that flares up when touched by rainforest water.", valaValue: 13, effect: "Heals sleep or daze status" },
  { id: "fora-10", name: "Koru Black Glass-shards", category: FoodCategory.FORAGED, originIsland: "Koru Basalt", description: "Brilliant silica obsidian reflecting orange hues, used for bartering.", valaValue: 18, effect: "Valuable resource" },
  { id: "fora-11", name: "Mase Salt-grass Blade", category: FoodCategory.FORAGED, originIsland: "Mase Shallows", description: "Highly crystallized leaves that taste intensely salty and sharp.", valaValue: 9, effect: "Restores 10 Memory" },
  { id: "fora-12", name: "Wesa Snow-mint Leaf", category: FoodCategory.FORAGED, originIsland: "Wesa High Lands", description: "Cooling leaf gathered from snowy ledges, keeps Numa focused.", valaValue: 12, effect: "Increases Memory limit temporarily (+15)" },
  { id: "fora-13", name: "Lovi Ironwood Sap-clot", category: FoodCategory.FORAGED, originIsland: "Lovi Canopy", description: "Hardened resin from centenarian trees, rich with aroma.", valaValue: 15, effect: "Provides passive HP health recovery" },
  { id: "fora-14", name: "Koru Pyrite Nugget", category: FoodCategory.FORAGED, originIsland: "Koru Basalt", description: "Brittle brassy cubes formed in thermal steam streams, heavy and metallic.", valaValue: 22, effect: "Trader exchange item" },
  { id: "fora-15", name: "Mase Coral-lime Fruit", category: FoodCategory.FORAGED, originIsland: "Mase Shallows", description: "Sour dwarf citrus that grows at the edge of tidal currents, refreshingly crisp.", valaValue: 11, effect: "Restores 20 Memory" },
  { id: "fora-16", name: "Wesa Vapor-shub", category: FoodCategory.FORAGED, originIsland: "Wesa High Lands", description: "A sponge-like moss that holds mountain cloud water like a bellows.", valaValue: 10, effect: "Cures Numa thermal heat burn" },
  { id: "fora-17", name: "Lovi Moss-apple", category: FoodCategory.FORAGED, originIsland: "Lovi Canopy", description: "Small fuzzy green fruit growing in canopy shade, taste of forest rain.", valaValue: 12, effect: "Restores 25 Memory" },
  { id: "fora-18", name: "Koru Sulphur Moss-clump", category: FoodCategory.FORAGED, originIsland: "Koru Basalt", description: "Glows with a warm pale-green light, can soothe volcanoc Numa's skin.", valaValue: 11, effect: "Restores 20 Memory" },
  { id: "fora-19", name: "Mase Sand-truffle", category: FoodCategory.FORAGED, originIsland: "Mase Shallows", description: "Strong pungent fungus buried under shoreline palm root-mounds.", valaValue: 25, effect: "Highly prized chef exchange token" },
  { id: "fora-20", name: "Wesa Cloud-berry", category: FoodCategory.FORAGED, originIsland: "Wesa High Lands", description: "Pale white soft cluster berries that melt on contact with direct body heat.", valaValue: 16, effect: "Increases Numa Stats slightly" },

  // DRINKS (20 items)
  { id: "drin-01", name: "Lovi Sweetwater Sap", category: FoodCategory.DRINK, originIsland: "Lovi Canopy", description: "Pure tapped fluid from ironwood boles, sweet and thirst-quenching.", valaValue: 8, effect: "Restores 15 Memory" },
  { id: "drin-02", name: "Koru Thermal Ash-Broth", category: FoodCategory.DRINK, originIsland: "Koru Basalt", description: "Warm alkaline fluid containing mineral sediment from high spring vents.", valaValue: 10, effect: "Restores 18 Memory & warm feeling" },
  { id: "drin-03", name: "Mase Sea-Vine Juice", category: FoodCategory.DRINK, originIsland: "Mase Shallows", description: "Salty-tangy liquid squeezed from beach creeper stems, thirst curing.", valaValue: 7, effect: "Restores 12 Memory" },
  { id: "drin-04", name: "Wesa Vapor-Tea", category: FoodCategory.DRINK, originIsland: "Wesa High Lands", description: "A hot infusion made with dry wind leaves and steaming high cloud droplets.", valaValue: 12, effect: "Stimulates Numa Resonance (+5)" },
  { id: "drin-05", name: "Lovi Orchid-Honeydew", category: FoodCategory.DRINK, originIsland: "Lovi Canopy", description: "Natural nectar collected from tree orchids at dawn break.", valaValue: 15, effect: "Increases bond speed" },
  { id: "drin-06", name: "Koru Flame-well Sap", category: FoodCategory.DRINK, originIsland: "Koru Basalt", description: "Viscous red extraction that boils when exposed to fresh air, extremely fiery.", valaValue: 16, effect: "Boosts Volcano Numa stats (+8)" },
  { id: "drin-07", name: "Mase Sponge-water", category: FoodCategory.DRINK, originIsland: "Mase Shallows", description: "Filtered water stored in giant barrel-sponges, cool and slightly saline.", valaValue: 6, effect: "Restores 10 Memory" },
  { id: "drin-08", name: "Wesa Echo-Well Water", category: FoodCategory.DRINK, originIsland: "Wesa High Lands", description: "Icy water pulled from bottomless mountain holes where air echoes.", valaValue: 11, effect: "Cures confusion daze" },
  { id: "drin-09", name: "Lovi Fern-shoot Tea", category: FoodCategory.DRINK, originIsland: "Lovi Canopy", description: "Bitter green brew that purges toxic substances from the bloodstream.", valaValue: 10, effect: "Cures poison status" },
  { id: "drin-10", name: "Koru Rust-Well Drink", category: FoodCategory.DRINK, originIsland: "Koru Basalt", description: "Iron-rich dark orange spring fluid that tastes like cold metal current.", valaValue: 11, effect: "Boosts Numa defense (+5)" },
  { id: "drin-11", name: "Mase Saltmarsh Ferment", category: FoodCategory.DRINK, originIsland: "Mase Shallows", description: "Bubbly salty fluid brewed from marsh seeds, highly pungent.", valaValue: 14, effect: "Restores 24 Memory" },
  { id: "drin-12", name: "Wesa Cloud-Plum Nectar", category: FoodCategory.DRINK, originIsland: "Wesa High Lands", description: "Sweet-sour thick syrup bottled from frozen plums, refreshing scent.", valaValue: 15, effect: "Increases Numa speed by 2" },
  { id: "drin-13", name: "Lovi Bamboo-Water", category: FoodCategory.DRINK, originIsland: "Lovi Canopy", description: "Water trapped inside hollow green cane sections, woody and cool.", valaValue: 7, effect: "Restores 13 Memory" },
  { id: "drin-14", name: "Koru Lava-Steam Dew", category: FoodCategory.DRINK, originIsland: "Koru Basalt", description: "Condensate collected from steam pipes, purified of sulphur.", valaValue: 9, effect: "Restores 16 Memory" },
  { id: "drin-15", name: "Mase Lagoon Kelp-Juice", category: FoodCategory.DRINK, originIsland: "Mase Shallows", description: "Thick green savory juice containing ground sea-current algae.", valaValue: 9, effect: "Restores 15 Memory" },
  { id: "drin-16", name: "Wesa Grass-Seed Milk", category: FoodCategory.DRINK, originIsland: "Wesa High Lands", description: "White milky extract from crushed wind seeds, mild and nut-like.", valaValue: 12, effect: "Restores 22 Memory" },
  { id: "drin-17", name: "Munu Spring Moss Cup", category: FoodCategory.DRINK, originIsland: "Lovi Canopy", description: "Infused rain-current tea made of green river moss.", valaValue: 8, effect: "Restores 15 Memory" },
  { id: "drin-18", name: "Kozu Hot-clay Broth", category: FoodCategory.DRINK, originIsland: "Koru Basalt", description: "Steeped red clay drink used by locals to gain stamina before forge work.", valaValue: 10, effect: "Restores 18 Memory" },
  { id: "drin-19", name: "Masa Tidal Swell Drink", category: FoodCategory.DRINK, originIsland: "Mase Shallows", description: "Salt syrup that aids Ocean Numa hydration on sandy banks.", valaValue: 10, effect: "Heals Reef Numa fatigue" },
  { id: "drin-20", name: "We High-Altitude Tonic", category: FoodCategory.DRINK, originIsland: "Wesa High Lands", description: "Distilled cold fog drops flavored with peak wintermint.", valaValue: 16, effect: "Heals all status conditions" },

  // PREPARED DISHES (20 items)
  { id: "prep-01", name: "Lovi Bamboo Steamed Paste", category: FoodCategory.PREPARED, originIsland: "Lovi Canopy", description: "Wild rice and canopy honeydew slow-steamed inside green bamboo segments.", valaValue: 20, effect: "Restores 35 Memory, heals poison" },
  { id: "prep-02", name: "Koru Fire-Roasted Tuber Mash", category: FoodCategory.PREPARED, originIsland: "Koru Basalt", description: "Smoked basalt starch root beaten into smooth paste with ground geyser nuts.", valaValue: 22, effect: "Restores 40 Memory, boosts defense" },
  { id: "prep-03", name: "Mase Salt-Crust Bun", category: FoodCategory.PREPARED, originIsland: "Mase Shallows", description: "Beach bulbs wrapped in salt crystals, slow-roasted until shell is crunchy.", valaValue: 18, effect: "Restores 30 Memory, boosts resonance" },
  { id: "prep-04", name: "Wesa Barley-Plum Porridge", category: FoodCategory.PREPARED, originIsland: "Wesa High Lands", description: "Wind-barley cooked under mountain snow with sliced star-plums and wind milk.", valaValue: 25, effect: "Restores 50 Memory, boosts attack" },
  { id: "prep-05", name: "Lovi Canopy Salad Bowl", category: FoodCategory.PREPARED, originIsland: "Lovi Canopy", description: "Assorted canopy leaves tossed with orchids and ironwood honey vinegar.", valaValue: 19, effect: "Restores 32 Memory" },
  { id: "prep-06", name: "Koru Ash-Baked Soka Loaf", category: FoodCategory.PREPARED, originIsland: "Koru Basalt", description: "Sourdough bread made with sulfur lichen and volcanic flour, dark and dense.", valaValue: 24, effect: "Restores 45 Memory" },
  { id: "prep-07", name: "Mase Tidepool Lagoon Pot", category: FoodCategory.PREPARED, originIsland: "Mase Shallows", description: "Stewed lagoon snails, beach beans, and seawater kelp, exceptionally savory.", valaValue: 22, effect: "Restores 38 Memory" },
  { id: "prep-08", name: "Wesa Cloud-curd Dumplings", category: FoodCategory.PREPARED, originIsland: "Wesa High Lands", description: "Fluffy barley flour pockets stuffed with spiced cloud curd, steamed in vapor.", valaValue: 26, effect: "Restores 52 Memory" },
  { id: "prep-09", name: "Lovi Vine-Wrapped Forest Tamale", category: FoodCategory.PREPARED, originIsland: "Lovi Canopy", description: "Fern pith and seed paste wrapped in leaf and scorched in wood embers.", valaValue: 18, effect: "Restores 28 Memory" },
  { id: "prep-10", name: "Koru Clay-Sealed Forge Pot", category: FoodCategory.PREPARED, originIsland: "Koru Basalt", description: "Tubers and lava nuts sealed inside a clay pot and thrown directly into forge heat.", valaValue: 24, effect: "Restores 44 Memory" },
  { id: "prep-11", name: "Mase Saltmarsh Snail Skewer", category: FoodCategory.PREPARED, originIsland: "Mase Shallows", description: "Reef snails marinated in sour lime-current juice, skewered on reef reed.", valaValue: 17, effect: "Restores 26 Memory" },
  { id: "prep-12", name: "Wesa High-Meadow Flapping Bread", category: FoodCategory.PREPARED, originIsland: "Wesa High Lands", description: "Flat wind bread designed to trap sky breeze, very light, crispy texture.", valaValue: 21, effect: "Restores 36 Memory" },
  { id: "prep-13", name: "Lovi Sweet Moss Jelly", category: FoodCategory.PREPARED, originIsland: "Lovi Canopy", description: "Sweet canopy sap solidified using moss-pith extract, emerald green cubes.", valaValue: 20, effect: "Increases companion Bond (+15)" },
  { id: "prep-14", name: "Koru Obsidian Charcoal Crisps", category: FoodCategory.PREPARED, originIsland: "Koru Basalt", description: "Thin sliced ash-bulbs dried on scorching obsidian rocks, smokey flavor.", valaValue: 19, effect: "Restores 30 Memory, heals daze" },
  { id: "prep-15", name: "Mase Sea-Vine Rollups", category: FoodCategory.PREPARED, originIsland: "Mase Shallows", description: "Sea-vines wrapped tightly over sand-peas, cooked in hot tidal sand.", valaValue: 18, effect: "Restores 29 Memory" },
  { id: "prep-16", name: "Wesa Sky-Melt Winter Porridge", category: FoodCategory.PREPARED, originIsland: "Wesa High Lands", description: "Rye hulls boiled in spring snow with alpine wintermint, very soothing.", valaValue: 22, effect: "Restores 40 Memory" },
  { id: "prep-17", name: "Lovi Ground Orchid Rice", category: FoodCategory.PREPARED, originIsland: "Lovi Canopy", description: "Forest grass rice cooked inside sweetwater orchid blossoms.", valaValue: 22, effect: "Restores 42 Memory" },
  { id: "prep-18", name: "Koru Ash-Bulb Thermal Stew", category: FoodCategory.PREPARED, originIsland: "Koru Basalt", description: "A hot broth made of boiled ash bulbs, hot geyser nut oil, and sulphur dabs.", valaValue: 23, effect: "Restores 43 Memory" },
  { id: "prep-19", name: "Mase Dry Shell-Crust Meal", category: FoodCategory.PREPARED, originIsland: "Mase Shallows", description: "Milled sand-beans mixed with dried snail powder, toasted heavily.", valaValue: 21, effect: "Restores 35 Memory" },
  { id: "prep-20", name: "Wesa Alpine Kite Cake", category: FoodCategory.PREPARED, originIsland: "Wesa High Lands", description: "Triangular wind-barley pastry sweetened with dried cloud fruit paste.", valaValue: 25, effect: "Restores 48 Memory" },

  // FESTIVAL FOODS (10 items)
  { id: "fest-01", name: "Lovi Suna Honey-Spire", category: FoodCategory.FESTIVAL, originIsland: "Lovi Canopy", description: "Weaved candy threads of concentrated ironwood honey, shaped like canopy roots.", valaValue: 40, effect: "Massive Companion Bond boost (+30)" },
  { id: "fest-02", name: "Koru Raza Volcano-Spark Loaf", category: FoodCategory.FESTIVAL, originIsland: "Koru Basalt", description: "Double-fermented sulfur loaf dusted with glowing pyrite dust, crackles in the mouth.", valaValue: 45, effect: "Fully restores Memory, cures daze" },
  { id: "fest-03", name: "Mase Sunset Lagoon-Shell Dish", category: FoodCategory.FESTIVAL, originIsland: "Mase Shallows", description: "Rare salt-marsh truffles steamed inside iridescent blue clam shells, high salt scent.", valaValue: 50, effect: "Increases Numa Resonance permanently (+2)" },
  { id: "fest-04", name: "Wesa Great Flight Wind-Roll", category: FoodCategory.FESTIVAL, originIsland: "Wesa High Lands", description: "Ultra-thin grass-paper sheets wrapped around cloud-plum sugar, melts immediately.", valaValue: 45, effect: "Increases Numa Current Attack permanently (+2)" },
  { id: "fest-05", name: "Suna Tave Moss Candy-rope", category: FoodCategory.FESTIVAL, originIsland: "Lovi Canopy", description: "Soft moss ropes steeped in vanilla honey, braided during the forest festival.", valaValue: 35, effect: "Boosts forest Numa bond significantly" },
  { id: "fest-06", name: "Raza Sose Torch Tuber", category: FoodCategory.FESTIVAL, originIsland: "Koru Basalt", description: "Smoked tuber stuffed with warm spicy volcano oil, served glowing like a coal.", valaValue: 38, effect: "Fully restores fire Numa stamina" },
  { id: "fest-07", name: "Munu Lowi Tide Cake", category: FoodCategory.FESTIVAL, originIsland: "Mase Shallows", description: "Traditional rice cake wrapped in beach reeds, made of reef-bean flour.", valaValue: 36, effect: "Boosts Reef Numa bond significantly" },
  { id: "fest-08", name: "We High Flight Vapor Pastry", category: FoodCategory.FESTIVAL, originIsland: "Wesa High Lands", description: "Woven barley pastry filled with light whipped wintermint foam.", valaValue: 42, effect: "Boosts Wind Numa bond significantly" },
  { id: "fest-09", name: "Primordial Sanu Ledger Sacramental Bun", category: FoodCategory.FESTIVAL, originIsland: "Lovi Canopy", description: "Rare ceremonial flour bun stamped with the munu root seal, eaten by apprentices.", valaValue: 60, effect: "Heals and maximizes Numa health/stats (+5 to all)" },
  { id: "fest-10", name: "Munu Divine Lagoon-Nectar", category: FoodCategory.FESTIVAL, originIsland: "Mase Shallows", description: "A divine sweet syrup obtained by fermenting coconut sap inside blue pearl shell.", valaValue: 55, effect: "Restores 100 Memory, heals all statuses" }
];

// Complete first 30 Numa list matching all 10 Classes, with evolution stages (`-i`, `-ku`, `-ma` suffix rules)
export const NUMA_ROSTER: Numa[] = [
  // 1. FOREST FAMILY (Taki Line, Starter) - IDs 001 - 003
  {
    id: "001",
    name: "Taki",
    class: NumaClass.FOREST,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "002",
    habitat: "Forest Lake mossbanks",
    behavior: "Extremely gentle, rolls around ironwood trunks and wraps its tail in damp forest moss to preserve hydration.",
    ecologicalRole: "Spreads moss seeds beneath canopy shadows, accelerating forest floor generation.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["stap-01", "fora-01", "drin-01"],
    baseStats: { memory: 40, current: 8, resonance: 6 }
  },
  {
    id: "002",
    name: "Takiku",
    class: NumaClass.FOREST,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "001",
    evolutionTargetId: "003",
    habitat: "Bamboo hollows and vertical canopies",
    behavior: "Grown up to map forest routes, communicates using low wind clicks on dry hollow reeds.",
    ecologicalRole: "Protects nesting forest avian species and guides juvenile forest lifeforms.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["prep-01", "stap-09", "drin-09"],
    baseStats: { memory: 75, current: 16, resonance: 14 }
  },
  {
    id: "003",
    name: "Takima",
    class: NumaClass.FOREST,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "002",
    habitat: "Centenarian Ironwood platforms",
    behavior: "Covered in glowing wood mold, sleeps for seasons and awakens to sing traditional forest current refrains.",
    ecologicalRole: "Channels earth nutrients through its mossy bark, stabilizing root-bound platforms.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["fest-01", "prep-13", "drin-05"],
    baseStats: { memory: 120, current: 28, resonance: 24 }
  },

  // 2. VOLCANO FAMILY (Kozui Line, Starter) - IDs 004 - 006
  {
    id: "004",
    name: "Kozui",
    class: NumaClass.VOLCANO,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "005",
    habitat: "Thermal ash banks and steam crevices",
    behavior: "Breathes tiny sulfur bubbles, loves to sleep in glowing ash-wells which triggers its iron skin hardening.",
    ecologicalRole: "Vents subterranean gases safely through its small volcanic back bellows.",
    primaryIsland: "Koru Basalt",
    favoriteFoodIds: ["stap-02", "fora-02", "drin-02"],
    baseStats: { memory: 38, current: 10, resonance: 5 }
  },
  {
    id: "005",
    name: "Kozuiku",
    class: NumaClass.VOLCANO,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "004",
    evolutionTargetId: "006",
    habitat: "Obsidian cliffs and thermal vents",
    behavior: "Fires sparks when excited, shapes cool basalt glass into armor plating for its primary joints.",
    ecologicalRole: "Melts hard ore nodes into accessible pockets, helping Kora potters extract fine clay.",
    primaryIsland: "Koru Basalt",
    favoriteFoodIds: ["prep-02", "fora-06", "drin-06"],
    baseStats: { memory: 72, current: 20, resonance: 12 }
  },
  {
    id: "006",
    name: "Kozuima",
    class: NumaClass.VOLCANO,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "005",
    habitat: "Main Caldera craters",
    behavior: "Radiates dry high heat, capable of sleeping directly in active red lava flows for multiple moons.",
    ecologicalRole: "Regulates regional tectonic current pulses, preventing sudden destructive eruptions.",
    primaryIsland: "Koru Basalt",
    favoriteFoodIds: ["fest-02", "prep-10", "drin-14"],
    baseStats: { memory: 115, current: 32, resonance: 20 }
  },

  // 3. REEF FAMILY (Vanui Line, Starter) - IDs 007 - 009
  {
    id: "007",
    name: "Vanui",
    class: NumaClass.REEF,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "008",
    habitat: "Lagoon shoreline tidepools",
    behavior: "Dances when waves crash, gathers glowing coral seeds inside its translucent, water-filled crown.",
    ecologicalRole: "Filters lagoon micro-sediments, ensuring crystal-clear shallow reef waters.",
    primaryIsland: "Mase Shallows",
    favoriteFoodIds: ["stap-03", "fora-03", "drin-03"],
    baseStats: { memory: 42, current: 6, resonance: 8 }
  },
  {
    id: "008",
    name: "Vanuiku",
    class: NumaClass.REEF,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "007",
    evolutionTargetId: "009",
    habitat: "Barrier coral gardens",
    behavior: "Emits low blue hums that resonate with tidal swell currents, extremely agile in rapid waters.",
    ecologicalRole: "Promotes calcite coral shell growth, expanding safe breeding grounds for reef life.",
    primaryIsland: "Mase Shallows",
    favoriteFoodIds: ["prep-03", "fora-07", "drin-07"],
    baseStats: { memory: 80, current: 14, resonance: 18 }
  },
  {
    id: "009",
    name: "Vanuima",
    class: NumaClass.REEF,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "008",
    habitat: "Deep tidal lagoon trenches",
    behavior: "Carries a sprawling mini-reef on its shell where dozens of reef fish and mosses thrive concurrently.",
    ecologicalRole: "Guardian of key tidal inlets, mapping underwater memory trails for migrating shoals.",
    primaryIsland: "Mase Shallows",
    favoriteFoodIds: ["fest-03", "prep-07", "drin-11"],
    baseStats: { memory: 130, current: 22, resonance: 30 }
  },

  // 4. WIND FAMILY (Seli Line) - IDs 010 - 012
  {
    id: "010",
    name: "Seli",
    class: NumaClass.WIND,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "011",
    habitat: "Echo flute cavities",
    behavior: "Gently whistles when high gusts blow. Feathery wings can lift it only short distances in high plateau thermals.",
    ecologicalRole: "Scatters alpine grass-pollen through whistling currents.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["stap-04", "fora-08", "drin-04"],
    baseStats: { memory: 35, current: 9, resonance: 4 }
  },
  {
    id: "011",
    name: "Seliku",
    class: NumaClass.WIND,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "010",
    evolutionTargetId: "012",
    habitat: "Alpine crests and grass meadows",
    behavior: "Rides shear high-altitude jets on grass-paper wings, communicating over immense distances via high chirps.",
    ecologicalRole: "Guides wind seeds to fertile mountain pockets, bridging ecosystems.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["prep-04", "fora-12", "drin-12"],
    baseStats: { memory: 68, current: 18, resonance: 10 }
  },
  {
    id: "012",
    name: "Selima",
    class: NumaClass.WIND,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "011",
    habitat: "Gale vapor plateaus",
    behavior: "Has massive wings composed of compressed sky-vapor. Glides for moons without landing.",
    ecologicalRole: "Balances upper atmospheric wind currents, calming violent hurricanes.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["fest-04", "prep-08", "drin-16"],
    baseStats: { memory: 110, current: 30, resonance: 18 }
  },

  // 5. OCEAN FAMILY (Woni Line) - IDs 013 - 015
  {
    id: "013",
    name: "Woni",
    class: NumaClass.OCEAN,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "014",
    habitat: "Deep lagoon borders",
    behavior: "Swells like a soft balloon when current shifts, blowing cool spray bubbles to alert other pod members.",
    ecologicalRole: "Distributes mineral deposits from deep currents onto outer reef banks.",
    primaryIsland: "Mase Shallows",
    favoriteFoodIds: ["stap-07", "drin-03", "fora-15"],
    baseStats: { memory: 45, current: 7, resonance: 6 }
  },
  {
    id: "014",
    name: "Woniku",
    class: NumaClass.OCEAN,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "013",
    evolutionTargetId: "015",
    habitat: "Open gulf blue water",
    behavior: "Coordinates pod movements using deep-resonating oceanic clicks that travel miles wet.",
    ecologicalRole: "Protects migrating shoals from heavy sea-current turbulence.",
    primaryIsland: "Mase Shallows",
    favoriteFoodIds: ["prep-15", "stap-11", "drin-15"],
    baseStats: { memory: 82, current: 15, resonance: 12 }
  },
  {
    id: "015",
    name: "Wonima",
    class: NumaClass.OCEAN,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "014",
    habitat: "Abyssal memory shelves",
    behavior: "Wise and passive giant with a whale-like build, completely silent except during solar eclipses.",
    ecologicalRole: "Keeps track of deep historical oceanic routes, directing seasonal ecosystem shifts.",
    primaryIsland: "Mase Shallows",
    favoriteFoodIds: ["fest-10", "prep-19", "drin-20"],
    baseStats: { memory: 135, current: 24, resonance: 24 }
  },

  // 6. CAVE FAMILY (Zumi Line) - IDs 016 - 018
  {
    id: "016",
    name: "Zumi",
    class: NumaClass.CAVE,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "017",
    habitat: "Dark cave limestone recesses",
    behavior: "Navigates blind using ears that pick up stone-wall echoes, sleeps hanging upside down on root-nodes.",
    ecologicalRole: "Carries subterranean lichen spores to deep obsidian cavities.",
    primaryIsland: "Koru Basalt",
    favoriteFoodIds: ["stap-06", "fora-10", "drin-10"],
    baseStats: { memory: 41, current: 8, resonance: 8 }
  },
  {
    id: "017",
    name: "Zumiku",
    class: NumaClass.CAVE,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "016",
    evolutionTargetId: "018",
    habitat: "Basalt caves and mineral tunnels",
    behavior: "Digs complex honeycomb tunnels, utilizing secret iron-hard claws that vibrate when gold-pyrite is nearby.",
    ecologicalRole: "Vents trapped geothermal vapor into hot chambers, warming underground colonies.",
    primaryIsland: "Koru Basalt",
    favoriteFoodIds: ["prep-06", "fora-14", "drin-14"],
    baseStats: { memory: 78, current: 17, resonance: 17 }
  },
  {
    id: "018",
    name: "Zumima",
    class: NumaClass.CAVE,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "017",
    habitat: "Primordial deep-rock domes",
    behavior: "Grown stone-like hide. Merges visually with cavern chambers to sleep for decades unaffected.",
    ecologicalRole: "Secures weak cave roots, preventing major sinkholes in populated plateaus.",
    primaryIsland: "Koru Basalt",
    favoriteFoodIds: ["fest-06", "prep-10", "drin-18"],
    baseStats: { memory: 125, current: 26, resonance: 28 }
  },

  // 7. MARSH FAMILY (Muli Line) - IDs 019 - 021
  {
    id: "019",
    name: "Muli",
    class: NumaClass.MARSH,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "020",
    habitat: "Salt-marsh delta reeds",
    behavior: "Conceals itself beneath giant lily pads, filtering mud waters to secure its micro-insect diet.",
    ecologicalRole: "Neutralizes stagnant salt-marsh toxins, aiding mangrove seedling success.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["stap-05", "fora-09", "drin-09"],
    baseStats: { memory: 44, current: 6, resonance: 7 }
  },
  {
    id: "020",
    name: "Muliku",
    class: NumaClass.MARSH,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "019",
    evolutionTargetId: "021",
    habitat: "Mangrove swamp borders",
    behavior: "Wades slowly in thick marshes. Its skin secretes a moss-promoting oil that heals surrounding flora.",
    ecologicalRole: "Anchors loose silt beds, protecting swamp architecture from monsoon tides.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["prep-09", "fora-17", "drin-17"],
    baseStats: { memory: 81, current: 12, resonance: 16 }
  },
  {
    id: "021",
    name: "Mulima",
    class: NumaClass.MARSH,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "020",
    habitat: "Sacred wetlands core",
    behavior: "A slow-moving swamp giant covered in blooming water orchids, acting as a living raft for small Numa.",
    ecologicalRole: "Channels deep swamp water currents, preventing root-rot in historic platforms.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["fest-05", "prep-13", "drin-19"],
    baseStats: { memory: 128, current: 21, resonance: 26 }
  },

  // 8. NIGHT FAMILY (Yasi Line) - IDs 022 - 024
  {
    id: "022",
    name: "Yasi",
    class: NumaClass.NIGHT,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "023",
    habitat: "Nocturnal canopy hollows",
    behavior: "Glares with glowing bioluminescent eyes at dusk; hides inside hollow wood logs during sunlit hours.",
    ecologicalRole: "Polliates midnight canopy lilies, which only bloom under yasa star light.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["stap-09", "fora-04", "drin-05"],
    baseStats: { memory: 37, current: 9, resonance: 4 }
  },
  {
    id: "023",
    name: "Yasiku",
    class: NumaClass.NIGHT,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "022",
    evolutionTargetId: "024",
    habitat: "Star-gazing moss cliffs",
    behavior: "Emits a soft wave of light from its tail to map paths for nocturnal explorers under deep cloud cover.",
    ecologicalRole: "Repels predatory nocturnal swamp-crawlers with rhythmic flashes.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["prep-13", "fora-17", "drin-12"],
    baseStats: { memory: 70, current: 19, resonance: 9 }
  },
  {
    id: "024",
    name: "Yasima",
    class: NumaClass.NIGHT,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "023",
    habitat: "Echo sky plateaus",
    behavior: "Grown magnificent starry patterns on its back which shift to synchronize with regional constellations.",
    ecologicalRole: "Regulates nocturnal wind-direction maps, aiding late night bird flyovers.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["fest-09", "prep-17", "drin-20"],
    baseStats: { memory: 112, current: 31, resonance: 16 }
  },

  // 9. ANCIENT FAMILY (Rili Line) - IDs 025 - 027
  {
    id: "025",
    name: "Rili",
    class: NumaClass.ANCIENT,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "026",
    habitat: "Sunken clay ruins",
    behavior: "Loves to search for broken pottery clay, playing rhythmic beats on its rock-like tail shell.",
    ecologicalRole: "Slowly uncovers ancient sanu symbols written on sunken stone tables.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["stap-12", "fora-13", "drin-08"],
    baseStats: { memory: 43, current: 7, resonance: 9 }
  },
  {
    id: "026",
    name: "Riliku",
    class: NumaClass.ANCIENT,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "025",
    evolutionTargetId: "027",
    habitat: "Eroded stone arches",
    behavior: "Understands lost linguistic sounds; hums in absolute harmony with local wind-catchers.",
    ecologicalRole: "Preserves the frequency of historic stone monuments, holding soil-erosion back.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["prep-12", "fora-19", "drin-16"],
    baseStats: { memory: 79, current: 13, resonance: 21 }
  },
  {
    id: "027",
    name: "Rilima",
    class: NumaClass.ANCIENT,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "026",
    habitat: "Forgotten central temple",
    behavior: "Spreads an aura of total peace. Its massive clay-skin shell is engraved with ancient historical lines.",
    ecologicalRole: "Guardian of ancestral memories, bridging player wisdom with primordial spirits.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["fest-09", "prep-20", "drin-20"],
    baseStats: { memory: 124, current: 22, resonance: 32 }
  },

  // 10. SPIRIT FAMILY (Kosei Line) - IDs 028 - 030
  {
    id: "028",
    name: "Kosei",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.JUVENILE,
    evolutionTargetId: "029",
    habitat: "Sweetwater spirit springs",
    behavior: "Drifts floating slightly above land, dissolving into glowing mist when startled, reforming nearby.",
    ecologicalRole: "Purifies water-current streams, washing away stagnant negative energy bubbles.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["stap-16", "fora-20", "drin-20"],
    baseStats: { memory: 36, current: 9, resonance: 5 }
  },
  {
    id: "029",
    name: "Koseiku",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.MATURE,
    evolutionOriginId: "028",
    evolutionTargetId: "030",
    habitat: "Cloud vapor cliffs",
    behavior: "Possesses a soft vocal range, mirroring lost ancestral songs to travelers on windy passes.",
    ecologicalRole: "Weaves high auroras under clear stars, stabilizing warm-cloud humidity.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["prep-16", "fora-20", "drin-12"],
    baseStats: { memory: 70, current: 19, resonance: 11 }
  },
  {
    id: "030",
    name: "Koseima",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.ELDER,
    evolutionOriginId: "029",
    habitat: "Primordial Cloud sanctuary",
    behavior: "Radiates pure current energy, completely intangible unless bonded with a master kora vessel explorer.",
    ecologicalRole: "Acts as a primary current beacon, guiding lost souls back to Sanu circles.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["fest-04", "prep-08", "drin-20"],
    baseStats: { memory: 115, current: 31, resonance: 20 }
  }
];

// 5 Primordial World Spirits - Fixed 4-letter 2-syllable names
export const PRIMORDIALS: Numa[] = [
  {
    id: "146",
    name: "Wera",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.PRIMORDIAL,
    habitat: "Solar Sky-Spire",
    behavior: "The primordial spirit of light and solar currents; hovers in high gold atmospheric bands.",
    ecologicalRole: "Regulates light warmth across the archipelago, triggering orchid blooms.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["fest-04", "fest-09"],
    baseStats: { memory: 200, current: 50, resonance: 40 }
  },
  {
    id: "147",
    name: "Raza",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.PRIMORDIAL,
    habitat: "Echo flute chambers",
    behavior: "The primordial spirit of the upper flight tides; flows invisibly like structural air currents.",
    ecologicalRole: "Carries sky seeds across all 4 islands, ensuring continuous genetic flow.",
    primaryIsland: "Wesa High Lands",
    favoriteFoodIds: ["fest-04", "fest-08"],
    baseStats: { memory: 190, current: 55, resonance: 35 }
  },
  {
    id: "148",
    name: "Kora",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.PRIMORDIAL,
    habitat: "Deep Obsidian Core",
    behavior: "The primordial spirit of geology and clay firing; radiates deep warmth and seismic weight.",
    ecologicalRole: "Hardens the foundation stone rows of each island against heavy tidal erosion.",
    primaryIsland: "Koru Basalt",
    favoriteFoodIds: ["fest-02", "fest-06"],
    baseStats: { memory: 220, current: 45, resonance: 55 }
  },
  {
    id: "149",
    name: "Sana",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.PRIMORDIAL,
    habitat: "Ancestral Moss Ledger Grove",
    behavior: "The primordial spirit of memory and history; takes the form of a deer with wooden glowing antlers.",
    ecologicalRole: "Archives the historic currents of the archipelago inside the root ledger.",
    primaryIsland: "Lovi Canopy",
    favoriteFoodIds: ["fest-01", "fest-05"],
    baseStats: { memory: 210, current: 42, resonance: 48 }
  },
  {
    id: "150",
    name: "Muna",
    class: NumaClass.SPIRIT,
    stage: EvolutionStage.PRIMORDIAL,
    habitat: "Lagoon Heart-spring",
    behavior: "The grand primordial life-well born from absolute pristine water current.",
    ecologicalRole: "The origin source of all Numa currents, maintaining biological harmony.",
    primaryIsland: "Mase Shallows",
    favoriteFoodIds: ["fest-03", "fest-07"],
    baseStats: { memory: 250, current: 60, resonance: 60 }
  }
];

// Helper to check language consistency
export function validateMunuWord(word: string): boolean {
  const cleanWord = word.toLowerCase().trim().replace(/[^a-z]/g, '');
  if (cleanWord.length === 0) return false;
  // Vowels: a, e, i, o, u
  // Consonants: k, m, n, r, s, t, v, w, y, z, l
  const validChars = new Set(['a', 'e', 'i', 'o', 'u', 'k', 'm', 'n', 'r', 's', 't', 'v', 'w', 'y', 'z', 'l']);
  for (let i = 0; i < cleanWord.length; i++) {
    if (!validChars.has(cleanWord[i])) {
      return false;
    }
  }
  return true;
}
