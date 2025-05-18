// sample-data.js
const bubbleTeaData = [
  {
id: "tea1",
    name: "Classic Pearl Milk Tea",
    description: "Rich black tea paired with creamy milk and chewy pearls, one of the most popular milk tea flavors.",
    imageUrl: "https://pic.nximg.cn/file/20210110/11601180_155245632081_2.jpg",
    prepTime: 20,
    category: "Milk Tea", // Added category
    ingredients: [
      { name: "Black tea bags", amount: "2 bags" },
      { name: "Water", amount: "500ml" },
      { name: "Condensed milk", amount: "2 tablespoons" },
      { name: "Tapioca pearls", amount: "50g" },
      { name: "White sugar", amount: "2 tablespoons" }
    ],
    steps: [
      "Place the pearls in boiling water and cook for about 15-20 minutes until all pearls float and soften, then rinse with cold water and soak in syrup.",
      "In another pot, bring water to a boil and steep the tea bags for 5 minutes.",
      "Add condensed milk and white sugar to the hot tea, stir well.",
      "Cool the milk tea to room temperature.",
      "Add an appropriate amount of pearls to the cup, pour in the milk tea, stir well and enjoy."
    ],
    tips: "Pearls will become too soft if cooked too long, or taste raw if undercooked. Adjust the ratio of sugar and milk according to personal preference."
  },
  {
    id: "tea2",
    name: "Taro Fresh Milk Tea",
    description: "Soft and sweet taro perfectly combined with refreshing fresh milk, rich in texture with distinct layers.",
    imageUrl: "https://glitz.beautyinsider.my/wp-content/uploads/2023/04/1448935262.jpg",
    prepTime: 25,
    category: "Milk Cap", // Added category
    ingredients: [
      { name: "Taro", amount: "200g" },
      { name: "Fresh milk", amount: "300ml" },
      { name: "Black tea", amount: "200ml" },
      { name: "White sugar", amount: "3 tablespoons" },
      { name: "Coconut cream", amount: "1 tablespoon" }
    ],
    steps: [
      "Peel and cube taro, steam until soft.",
      "Mash the steamed taro, add 1 tablespoon of white sugar and coconut cream, mix well.",
      "Brew black tea and add the remaining white sugar to taste.",
      "Put an appropriate amount of taro paste in the cup.",
      "Pour in black tea and fresh milk, stir gently."
    ],
    tips: "Taro paste can be prepared in advance and refrigerated. Adjust the ratio of fresh milk and tea to change the taste."
  },
  {
    id: "tea3",
    name: "Fruit Tea",
    description: "A fresh combination of fruits and tea, healthy and delicious, rich in vitamins and antioxidants.",
    imageUrl: "https://th.bing.com/th/id/OIP.K1fKgBxQU_Vs7nA5Yl7ezwHaKh?rs=1&pid=ImgDetMain",
    prepTime: 15,
    category: "Fruit Tea", // Added category
    ingredients: [
      { name: "Green tea bags", amount: "2 bags" },
      { name: "Water", amount: "500ml" },
      { name: "Honey", amount: "2 tablespoons" },
      { name: "Strawberries", amount: "100g" },
      { name: "Blueberries", amount: "50g" },
      { name: "Orange", amount: "half" },
      { name: "Lemon", amount: "2 slices" }
    ],
    steps: [
      "Steep green tea bags in hot water for 3-5 minutes, remove tea bags.",
      "Add honey and stir well, then cool.",
      "Wash and slice fruits.",
      "Place sliced fruits in the cup.",
      "Pour in the cooled tea, stir gently."
    ],
    tips: "You can choose different fruits according to the season. Tea can be prepared in advance and refrigerated. Adding mint leaves will enhance freshness."
  },
  {
    id: "tea4",
    name: "Caramel Milk Tea",
    description: "Rich caramel aroma perfectly blended with smooth milk tea, a sweet but not greasy experience.",
    imageUrl: "https://puui.qpic.cn/vpic_cover/s32281mtcva/s32281mtcva_hz.jpg/1280",
    prepTime: 18,
    category: "Coffee", // Added category
    ingredients: [
      { name: "Black tea bags", amount: "2 bags" },
      { name: "Water", amount: "400ml" },
      { name: "Milk", amount: "100ml" },
      { name: "White sugar", amount: "3 tablespoons" },
      { name: "Caramel sauce", amount: "2 tablespoons" }
    ],
    steps: [
      "Steep black tea bags in hot water for 5 minutes.",
      "Remove tea bags, add white sugar and stir until dissolved.",
      "Add milk and stir well.",
      "Evenly coat the inside of the cup with a layer of caramel sauce.",
      "Pour in the milk tea, drizzle some caramel sauce on top."
    ],
    tips: "You can make homemade caramel sauce: heat white sugar in a pan over low heat until amber-colored, add a small amount of hot water and stir well."
  },
  {
    id: "tea5",
    name: "Matcha Milk Green Tea",
    description: "Perfect combination of Japanese matcha's fresh aroma and milk's richness, a wonderful blend of bitter and sweet flavors.",
    imageUrl: "https://th.bing.com/th/id/OIP.4RlnQgPck0atgayP5wpOywHaLH?rs=1&pid=ImgDetMain",
    prepTime: 12,
    category: "Health Tea", // Added category
    ingredients: [
      { name: "Matcha powder", amount: "2 teaspoons" },
      { name: "Hot water", amount: "50ml" },
      { name: "Cold water", amount: "250ml" },
      { name: "Milk", amount: "200ml" },
      { name: "Honey", amount: "1 tablespoon" },
      { name: "Ice cubes", amount: "as needed" }
    ],
    steps: [
      "Put matcha powder in a bowl, add hot water and stir into a paste, ensuring no lumps.",
      "Add cold water and honey, stir well.",
      "Pour in milk, gently stir.",
      "Add ice cubes and serve."
    ],
    tips: "Using high-quality matcha powder gives better results. You can add tapioca pearls or coconut jelly for texture."
  },
  
  {
    id: "tea6",
    name: "Strawberry Milk Cap",
    description: "Perfect combination of fresh strawberries and silky milk cap, sweet and tangy with distinct layers.",
    imageUrl: "https://th.bing.com/th/id/OIP.WCe5EnIEzKMVAkVIJ4bx0QHaHa?rs=1&pid=ImgDetMain",
    prepTime: 20,
    category: "Milk Cap",
    ingredients: [
      { name: "Strawberries", amount: "150g" },
      { name: "Green tea", amount: "300ml" },
      { name: "Whipping cream", amount: "150ml" },
      { name: "Cheese powder", amount: "20g" },
      { name: "White sugar", amount: "2 tablespoons" }
    ],
    steps: [
      "Wash and chop strawberries, place in a bowl with a little sugar and marinate for 10 minutes.",
      "Brew green tea and let it cool.",
      "Whip cream to soft peaks, add cheese powder and white sugar, continue whipping to firm peaks.",
      "Place strawberry pieces in cup, pour in green tea.",
      "Slowly pour the milk cap on top, sprinkle with some strawberry bits."
    ],
    tips: "Don't whip the milk cap too stiff, keep it soft for better blending with the tea."
  },
  {
    id: "tea7",
    name: "Mocha Coffee",
    description: "Wonderful fusion of rich coffee and chocolate, a thick and sweet taste that lingers.",
    imageUrl: "https://th.bing.com/th/id/OIP.6ufZuxmJH9KbUoKrw63BQQHaJ4?rs=1&pid=ImgDetMain",
    prepTime: 15,
    category: "Coffee",
    ingredients: [
      { name: "Coffee grounds", amount: "15g" },
      { name: "Hot water", amount: "200ml" },
      { name: "Chocolate sauce", amount: "30ml" },
      { name: "Milk", amount: "150ml" },
      { name: "Fresh cream", amount: "as needed" }
    ],
    steps: [
      "Brew coffee grounds with hot water to make espresso.",
      "Add chocolate sauce to the bottom of the cup.",
      "Pour in hot coffee, stir well.",
      "Heat milk and make milk foam.",
      "Pour hot milk into coffee, top with milk foam.",
      "Optionally sprinkle with cocoa powder for garnish."
    ],
    tips: "Use an espresso machine for better flavor, pay attention to temperature control when making milk foam."
  },
  {
    id: "tea8",
    name: "Chrysanthemum Goji Berry Tea",
    description: "Traditional health tea, clears heat and detoxifies, nourishes eyes, with long-lasting sweet aftertaste.",
    imageUrl: "https://th.bing.com/th/id/OIP.TLs3RV6Q_CuJUopXD8jyQQHaHa?rs=1&pid=ImgDetMain",
    prepTime: 10,
    category: "Health Tea",
    ingredients: [
      { name: "Chrysanthemum", amount: "10g" },
      { name: "Goji berries", amount: "5g" },
      { name: "Rock sugar", amount: "to taste" },
      { name: "Hot water", amount: "500ml" }
    ],
    steps: [
      "Wash chrysanthemum and goji berries.",
      "Place chrysanthemum in cup, pour in hot water and steep for 3 minutes.",
      "Add goji berries and rock sugar to taste.",
      "Cover with lid and steep for 3-5 minutes before drinking."
    ],
    tips: "Adjust rock sugar amount according to personal taste, or substitute with honey. Can be re-infused multiple times and still retain aroma."
  },
  {
    id: "tea9",
    name: "Oolong Milk Tea",
    description: "Perfect fusion of oolong tea's unique aroma and milk's richness, with strong tea fragrance and lasting sweetness.",
    imageUrl: "https://th.bing.com/th/id/OIP.n2YWOcf3mW0NebhMMjgGiQHaKe?rs=1&pid=ImgDetMain",
    prepTime: 15,
    category: "Milk Tea",
    ingredients: [
      { name: "Oolong tea leaves", amount: "10g" },
      { name: "Water", amount: "400ml" },
      { name: "Milk", amount: "150ml" },
      { name: "White sugar", amount: "to taste" }
    ],
    steps: [
      "Steep oolong tea in hot water for 5 minutes to make strong tea.",
      "Strain out tea leaves, add white sugar and stir well.",
      "After the tea cools slightly, add milk and stir well.",
      "Optionally add tapioca pearls or other toppings according to preference."
    ],
    tips: "Don't boil oolong tea to avoid destroying the aroma. Milk can be substituted with fresh milk or condensed milk."
  },
  {
    id: "tea10",
    name: "Lemon Honey Tea",
    description: "Perfect combination of fresh, tangy lemon and natural honey, refreshing and beauty-enhancing.",
    imageUrl: "https://picb3.photophoto.cn/29/818/29818173_1.jpg",
    prepTime: 10,
    category: "Fruit Tea",
    ingredients: [
      { name: "Lemon", amount: "1 piece" },
      { name: "Honey", amount: "3 tablespoons" },
      { name: "Hot water", amount: "500ml" },
      { name: "Mint leaves", amount: "a few (optional)" }
    ],
    steps: [
      "Wash and slice lemon, remove seeds.",
      "Place lemon slices in cup.",
      "Pour in hot water (not too hot to preserve honey's nutrients).",
      "Add honey and stir well.",
      "Optionally add a few mint leaves for garnish."
    ],
    tips: "Add honey when water temperature is below 60 degrees to preserve nutrients. Can be refrigerated and served cold."
  },
  {
      id: "tea11",
      name: "Rose Milk Tea",
      description: "The perfect combination of rose fragrance and rich milk tea, romantic and healthy.",
      imageUrl: "https://th.bing.com/th/id/OIP.JI1RQg_2J022v1Ad463JXwHaHa?rs=1&pid=ImgDetMain",
      prepTime: 15,
      category: "Floral Tea",
      ingredients: [
        {name: "Black tea bag", amount: "1 bag"},
        {name: "Dried rose petals", amount: "1 teaspoon"},
        {name: "Milk", amount: "100ml"},
        {name: "Rock sugar", amount: "to taste"}
      ],
      steps: [
        "Place the black tea bag and rose petals in a pot and brew with hot water",
        "Add rock sugar and stir until dissolved",
        "Pour in milk and stir well",
        "Steep for 3-5 minutes before drinking"
      ],
      tips: "Don't use too many rose petals or it will taste bitter. You can add condensed milk for extra creaminess."
    },
    {
      id: "tea12",
      name: "Caramel Milk Tea",
      description: "The perfect fusion of caramel sweetness and silky milk tea, sweet but not greasy.",
      imageUrl: "https://th.bing.com/th/id/OIP.Xs6DbiSr7CfHDXNg6nodmwHaFj?rs=1&pid=ImgDetMain",
      prepTime: 18,
      category: "Milk Tea",
      ingredients: [
        {name: "Black tea", amount: "20g"},
        {name: "Milk", amount: "500ml"},
        {name: "White sugar", amount: "100g"},
        {name: "Water", amount: "200ml"}
      ],
      steps: [
        "Put black tea and white sugar together in a pot to make caramel",
        "When the sugar turns reddish-brown, quickly add water and milk",
        "Bring to a boil over high heat, then turn off the heat",
        "Strain out the tea leaves and serve"
      ],
      tips: "Use low heat when making caramel to avoid burning. You can substitute milk powder for fresh milk."
    },
    {
      id: "tea13",
      name: "Strawberry Cheese Milk Cap",
      description: "Perfect combination of fresh strawberries and smooth cheese milk cap, rich in layers.",
      imageUrl: "https://th.bing.com/th/id/OIP.aocaJ0W6DXj66YuiheMOXgHaJ4?rs=1&pid=ImgDetMain",
      prepTime: 20,
      category: "Milk Cap",
      ingredients: [
        {name: "Strawberries", amount: "15 pieces"},
        {name: "Jasmine green tea", amount: "150ml"},
        {name: "Whipping cream", amount: "100ml"},
        {name: "Cream cheese", amount: "20g"},
        {name: "Milk", amount: "30ml"},
        {name: "Sugar", amount: "30g"}
      ],
      steps: [
        "Wash and chop strawberries, blend with green tea, ice, and sugar",
        "Melt cream cheese over a water bath",
        "Whip the cream with sugar until thick",
        "Pour strawberry tea into the cup first, then slowly pour in the milk cap",
        "Decorate with strawberries and matcha powder"
      ],
      tips: "Adding strawberries in two batches can create different texture for the fruit bits."
    },
    {
      id: "tea14",
      name: "Mocha Coffee",
      description: "Perfect balance between the bitterness of coffee and the sweetness of chocolate, energizing.",
      imageUrl: "https://th.bing.com/th/id/OIP.VMxAsjK_2uFywOr9Qs3hEgHaJU?rs=1&pid=ImgDetMain",
      prepTime: 15,
      category: "Coffee",
      ingredients: [
        {name: "Espresso", amount: "30ml"},
        {name: "Chocolate sauce", amount: "to taste"},
        {name: "Fresh cream", amount: "to taste"},
        {name: "Milk", amount: "to taste"}
      ],
      steps: [
        "Pour espresso and milk into a cup, filling it 7/10 full",
        "Top with whipped fresh cream",
        "Drizzle chocolate sauce on top for decoration"
      ],
      tips: "Use a moka pot to make espresso for better flavor."
    },
    {
      id: "tea15",
      name: "Goji Berry Chrysanthemum Tea",
      description: "Traditional health tea, clears heat and detoxifies, nourishes and brightens the eyes.",
      imageUrl: "https://th.bing.com/th/id/OIP.p4sgN82woF1yfrJvTN7nAwHaHa?rs=1&pid=ImgDetMain",
      prepTime: 10,
      category: "Health Tea",
      ingredients: [
        {name: "Goji berries", amount: "10g"},
        {name: "Chrysanthemum", amount: "3g"},
        {name: "Rock sugar", amount: "to taste"},
        {name: "Hot water", amount: "500ml"}
      ],
      steps: [
        "Wash the goji berries and chrysanthemum",
        "Place them in a cup and steep with hot water",
        "Add rock sugar to taste",
        "Steep for 3-5 minutes before drinking"
      ],
      tips: "Not recommended for long-term use by those with weak spleen and stomach. Add red dates for extra sweetness."
    },
    {
      id: "tea16",
      name: "Hong Kong Stocking Milk Tea",
      description: "Classic Hong Kong flavor, rich and smooth tea, filtered through a special stocking tea bag.",
      imageUrl: "https://th.bing.com/th/id/OIP.YemCqpWaz04VEW5yUu-UZAHaJ3?rs=1&pid=ImgDetMain",
      prepTime: 15,
      category: "Milk Tea",
      ingredients: [
        {name: "Ceylon black tea", amount: "40g"},
        {name: "Whole milk", amount: "200ml"},
        {name: "White sugar", amount: "30g"},
        {name: "Water", amount: "500ml"}
      ],
      steps: [
        "Place the black tea in a stocking tea bag and steep in boiling water for 5 minutes",
        "Pull the tea bag up and down in the cup 6-8 times",
        "Add milk and sugar, stir well",
        "Can be served hot or with ice cubes for cold drink"
      ],
      tips: "Using evaporated milk can increase richness, more tea pulling times make tea more flavorful."
    },
    {
      id: "tea17",
      name: "Grass Jelly Milk Tea",
      description: "Taiwanese specialty drink, perfect combination of cooling grass jelly and rich milk tea.",
      imageUrl: "https://th.bing.com/th/id/OIP.nyruuUnjCGEsC_l93j7tXgHaKe?rs=1&pid=ImgDetMain",
      prepTime: 25,
      category: "Milk Tea",
      ingredients: [
        {name: "Grass jelly powder", amount: "30g"},
        {name: "Black tea bags", amount: "2 bags"},
        {name: "Milk", amount: "200ml"},
        {name: "Sugar", amount: "to taste"}
      ],
      steps: [
        "Cook grass jelly powder with water, cool and cut into cubes",
        "Steep black tea bags in hot water for 5 minutes",
        "Add milk and sugar to make milk tea",
        "Put grass jelly in cup, pour in milk tea"
      ],
      tips: "Grass jelly can be made ahead and refrigerated for better texture."
    },
    {
      id: "tea18",
      name: "Thai Milk Tea",
      description: "Unique orange-red color, rich tea aroma with special spice flavors.",
      imageUrl: "https://media.istockphoto.com/id/505481795/zh/%E5%90%91%E9%87%8F/thai-tea.jpg?s=612x612&w=0&k=20&c=J2WIefgm9pQz8Mc2ckmXFbK-xbXyV67IEX-RyPLGkn0=",
      prepTime: 10,
      category: "Milk Tea",
      ingredients: [
        {name: "Thai tea mix", amount: "2 tablespoons"},
        {name: "Condensed milk", amount: "2 tablespoons"},
        {name: "Evaporated milk", amount: "1 tablespoon"},
        {name: "Sugar", amount: "1 tablespoon"}
      ],
      steps: [
        "Steep Thai tea mix in boiling water for 5 minutes",
        "Add condensed milk and sugar, stir well",
        "Pour into cup, slowly add evaporated milk on top",
        "Fill with ice cubes"
      ],
      tips: "Use Thai Hand Brand tea mix for authentic orange-red color."
    },
    {
      id: "tea19",
      name: "Zero Calorie Sugar Milk Tea",
      description: "Healthy low-calorie version, using sugar substitutes to maintain sweetness without guilt.",
      imageUrl: "https://th.bing.com/th/id/R.ff7f91d1d41043a0aa3178f893cf4f7b?rik=0KSbLvyAHMjgxw&riu=http%3a%2f%2fbpic.588ku.com%2felement_origin_min_pic%2f17%2f11%2f14%2f51dfb9a2700ed77687615abbcb841945.jpg&ehk=45GND%2fnP0NASpJeG5CXBarUoJUryXWVX1Efk%2fB7ZIeY%3d&risl=&pid=ImgRaw&r=0",
      prepTime: 10,
      category: "Health Tea",
      ingredients: [
        {name: "Earl Grey tea bag", amount: "1 bag"},
        {name: "Pure milk", amount: "240ml"},
        {name: "Zero calorie sweetener", amount: "2g"},
        {name: "Evaporated milk", amount: "50g"}
      ],
      steps: [
        "Mix milk, evaporated milk and zero calorie sweetener, bring to boil for 1 minute",
        "Add tea bag and steep for 20 minutes",
        "Remove tea bag, strain and serve"
      ],
      tips: "If you don't have zero calorie sweetener, 10g white sugar can be substituted but will increase calories."
    },
    {
      id: "tea20",
      name: "Matcha Red Bean Milk Tea",
      description: "Classic combination of Japanese matcha and sweet red beans, rich in layers.",
      imageUrl: "https://th.bing.com/th/id/OIP.Y9SEmHiIwjo5mx9Hi1yv2gHaMb?rs=1&pid=ImgDetMain",
      prepTime: 15,
      category: "Milk Tea",
      ingredients: [
        {name: "Matcha powder", amount: "2 teaspoons"},
        {name: "Milk", amount: "200ml"},
        {name: "Sweetened red beans", amount: "50g"},
        {name: "Sugar", amount: "1 tablespoon"}
      ],
      steps: [
        "Mix matcha powder with a small amount of hot water to form a paste",
        "Add hot milk and sugar, stir well",
        "Put sweetened red beans in cup, pour in matcha milk tea"
      ],
      tips: "Using high-quality matcha powder creates a more vivid green color and better flavor."
    },
    {
      id: "tea21",
      name: "Mango Coconut Smoothie",
      description: "Perfect fusion of tropical mango and coconut milk, a refreshing summer drink.",
      imageUrl: "https://th.bing.com/th/id/R.2441fbf8cb89c17f0ff70f6e9985c85c?rik=jzxviGFToMD8RA&pid=ImgRaw&r=0",
      prepTime: 15,
      category: "Smoothie",
      ingredients: [
        {name: "Mango flesh", amount: "200g"},
        {name: "Coconut milk", amount: "150ml"},
        {name: "Ice cubes", amount: "1 cup"},
        {name: "Honey", amount: "1 tablespoon"}
      ],
      steps: [
        "Put mango flesh, coconut milk, and honey in blender",
        "Add ice cubes and blend until smooth",
        "Pour into cup and enjoy"
      ],
      tips: "Using ripe mangoes will make it sweeter. You can add a bit of lemon juice for extra flavor."
    },
    {
      id: "tea22",
      name: "Brown Sugar Pearl Fresh Milk",
      description: "Classic combination of rich brown sugar and chewy pearls, paired with creamy fresh milk, rich in layers.",
      imageUrl: "https://th.bing.com/th/id/OIP.9Ufqk7jBzLunjKunp6cyewHaJb?rs=1&pid=ImgDetMain",
      prepTime: 25,
      category: "Milk Tea",
      ingredients: [
        {name: "Brown sugar", amount: "50g"},
        {name: "Tapioca pearls", amount: "1/2 cup"},
        {name: "Fresh milk", amount: "300ml"},
        {name: "Water", amount: "100ml"}
      ],
      steps: [
        "Cook brown sugar and water into syrup",
        "Cook tapioca pearls until done, then soak in brown sugar syrup",
        "Put brown sugar pearls in cup first",
        "Slowly pour in fresh milk to create a layered effect"
      ],
      tips: "You can pour the milk along the side of the cup to create a more beautiful layered effect."
    },
    {
      id: "tea23",
      name: "Blueberry Yogurt Smoothie",
      description: "Refreshing combination of fresh blueberries and yogurt, rich in antioxidants, healthy and delicious.",
      imageUrl: "https://th.bing.com/th/id/OIP.-Y7ZdUodDE11aV6m8RLFmQHaHf?rs=1&pid=ImgDetMain",
      prepTime: 10,
      category: "Fruit Tea",
      ingredients: [
        {name: "Blueberries", amount: "1 cup"},
        {name: "Yogurt", amount: "200ml"},
        {name: "Honey", amount: "1 tablespoon"},
        {name: "Ice cubes", amount: "1 cup"}
      ],
      steps: [
        "Put all ingredients in blender",
        "Blend until smooth",
        "Pour into cup and serve"
      ],
      tips: "Using frozen blueberries can increase the smoothie's thickness."
    },
    {
      id: "tea24",
      name: "Ginger Milk Curd",
      description: "Traditional Cantonese dessert, unique flavor from the collision of spicy ginger and sweet milk.",
      imageUrl: "https://pic.616pic.com/ys_bnew_img/00/46/65/Mz1rIZMpv0.jpg",
      prepTime: 20,
      category: "Health Tea",
      ingredients: [
        {name: "Old ginger", amount: "50g"},
        {name: "Whole milk", amount: "200ml"},
        {name: "White sugar", amount: "20g"}
      ],
      steps: [
        "Grate ginger and squeeze out the juice",
        "Heat milk with sugar to about 80°C",
        "Quickly pour hot milk into ginger juice",
        "Let it sit for 5 minutes to solidify"
      ],
      tips: "Fresh old ginger works best, temperature control is key."
    },
    {
      id: "tea25",
      name: "Cheese Cap Four Seasons Spring Tea",
      description: "Fragrant Four Seasons Spring tea base topped with rich cheese cap, distinct layered taste.",
      imageUrl: "https://th.bing.com/th/id/R.489f3c9af233695e0dc4e267a3d3e186?rik=83PUk7jCljpF%2bg&riu=http%3a%2f%2fpic.ntimg.cn%2ffile%2f20190805%2f27553602_163009935081_2.jpg&ehk=F%2bjx82OQ%2bYA2D2Rqi0hSjSEdHcpNfJtTqsHQ2I195eM%3d&risl=&pid=ImgRaw&r=0",
      prepTime: 15,
      category: "Milk Cap",
      ingredients: [
        {name: "Four Seasons Spring tea leaves", amount: "5g"},
        {name: "Whipping cream", amount: "100ml"},
        {name: "Cream cheese", amount: "30g"},
        {name: "Sea salt", amount: "a pinch"}
      ],
      steps: [
        "Brew Four Seasons Spring tea and cool it down",
        "Whip the cream until 60% stiff",
        "Add cream cheese and sea salt, continue whipping",
        "Pour tea into cup, slowly add cheese cap on top"
      ],
      tips: "Don't whip the cap too stiff, a flowing texture tastes better."
    },
    {
      id: "tea26",
      name: "Coconut Taro Milk Tea",
      description: "Perfect combination of rich coconut milk and smooth taro paste, rich in texture with distinct layers.",
      imageUrl: "https://th.bing.com/th/id/OIP.6bHTbk_gnCSSaZdepDS4iQHaKe?rs=1&pid=ImgDetMain",
      prepTime: 25,
      category: "Milk Tea",
      ingredients: [
        {name: "Taro", amount: "200g"},
        {name: "Coconut milk", amount: "300ml"},
        {name: "Black tea", amount: "200ml"},
        {name: "White sugar", amount: "3 tablespoons"},
        {name: "Coconut cream", amount: "1 tablespoon"}
      ],
      steps: [
        "Peel and cube taro, steam until soft",
        "Mash steamed taro, add 1 tablespoon white sugar and coconut cream, mix well",
        "Brew black tea, add remaining white sugar to taste",
        "Put appropriate amount of taro paste in cup",
        "Pour in black tea and coconut milk, stir gently"
      ],
      tips: "Taro paste can be prepared in advance and refrigerated. Adjust the ratio of coconut milk to tea to change the taste."
    },
    {
      id: "tea27",
      name: "Honey Grapefruit Tea",
      description: "Perfect combination of fresh, sweet-sour grapefruit and natural honey, refreshing and beauty-enhancing.",
      imageUrl: "https://th.bing.com/th/id/OIP.h9aV7z1IXoob7g9BqzZAyQHaHa?rs=1&pid=ImgDetMain",
      prepTime: 10,
      category: "Fruit Tea",
      ingredients: [
        {name: "Grapefruit", amount: "1/4 piece"},
        {name: "Honey", amount: "3 tablespoons"},
        {name: "Hot water", amount: "500ml"},
        {name: "Mint leaves", amount: "a few (optional)"}
      ],
      steps: [
        "Wash and slice grapefruit, remove seeds",
        "Put grapefruit slices in cup",
        "Pour in hot water (not too hot to preserve honey nutrients)",
        "Add honey and stir well",
        "Add a few mint leaves for garnish if desired"
      ],
      tips: "Add honey when water temperature is below 60 degrees to preserve nutrients. Can be refrigerated and served cold."
    },
    {
      id: "tea28",
      name: "Chocolate Oatmeal Milk Tea",
      description: "Perfect pairing of rich chocolate and healthy oats, nutritious and delicious.",
      imageUrl: "https://th.bing.com/th/id/OIP.lTZM-F87Orq03C-WnGzSWAHaHa?rs=1&pid=ImgDetMain",
      prepTime: 15,
      category: "Milk Tea",
      ingredients: [
        {name: "Oatmeal", amount: "50g"},
        {name: "Milk", amount: "300ml"},
        {name: "Chocolate sauce", amount: "2 tablespoons"},
        {name: "White sugar", amount: "1 tablespoon"}
      ],
      steps: [
        "Cook oatmeal with a small amount of water until soft",
        "Add milk and chocolate sauce, stir well",
        "Add white sugar to taste",
        "Cook over low heat until slightly boiling"
      ],
      tips: "You can use instant oatmeal to save time. Chocolate sauce can be substituted with cocoa powder."
    },
    {
      id: "tea29",
      name: "Lychee Rose Iced Tea",
      description: "Romantic combination of sweet lychee and rose, perfect summer refreshment.",
      imageUrl: "https://th.bing.com/th/id/OIP.5MiZe7R81296Gv9jUufsYgHaHa?rs=1&pid=ImgDetMain",
      prepTime: 20,
      category: "Fruit Tea",
      ingredients: [
        {name: "Lychee", amount: "10 pieces"},
        {name: "Dried rose petals", amount: "1 teaspoon"},
        {name: "Green tea", amount: "300ml"},
        {name: "Honey", amount: "2 tablespoons"},
        {name: "Ice cubes", amount: "as needed"}
      ],
      steps: [
        "Peel and pit lychees, set flesh aside",
        "Steep rose petals and green tea together for 5 minutes",
        "Add honey and stir well",
        "Put lychee flesh and ice cubes in cup",
        "Pour in cooled rose green tea"
      ],
      tips: "Frozen lychees can be used for convenience. Don't use too many rose petals or it will taste bitter."
    },
     {
      id: "tea30",
      name: "Rose Lychee Iced Tea",
      description: "Perfect fusion of lychee's sweetness and rose's fragrance, refreshing summer special drink.",
      imageUrl: "https://img.tukuppt.com/png_preview/02/94/96/xr0gw4H16D.jpg!/fw/780",
      prepTime: 15,
      category: "Fruit Tea",
      ingredients: [
        {name: "Lychee", amount: "6-8 pieces"},
        {name: "Dried rose flowers", amount: "5-6 pieces"},
        {name: "Green tea", amount: "5g"},
        {name: "Honey", amount: "to taste"},
        {name: "Ice cubes", amount: "as needed"}
      ],
      steps: [
        "Peel lychees and remove flesh, wash rose petals clean",
        "Steep green tea in boiling water for 2-3 minutes, strain and cool",
        "Put lychee flesh and rose petals in cup",
        "Pour in cooled green tea, add honey to taste",
        "Finally add ice cubes to serve"
      ],
      tips: "Fresh rose petals can be used for enhanced aroma, refrigerate for better flavor."
    },
    {
      id: "tea31",
      name: "Taro Ball Coconut Smoothie",
      description: "Perfect combination of chewy taro balls and rich coconut milk, icy texture essential for summer.",
      imageUrl: "https://th.bing.com/th/id/OIP.MqHGdl5b6InC4jj1Q-SnOgHaFj?rs=1&pid=ImgDetMain",
      prepTime: 25,
      category: "Smoothie",
      ingredients: [
        {name: "Taro balls", amount: "100g"},
        {name: "Coconut milk", amount: "200ml"},
        {name: "Condensed milk", amount: "2 tablespoons"},
        {name: "Ice cubes", amount: "1 cup"},
        {name: "Sweetened red beans", amount: "as needed"}
      ],
      steps: [
        "Cook taro balls until done, rinse with cold water for chewy texture",
        "Blend coconut milk, condensed milk and ice cubes into a smoothie",
        "Put cooked taro balls in cup first",
        "Pour in coconut smoothie",
        "Top with sweetened red beans for garnish"
      ],
      tips: "Taro balls can be made ahead and frozen, cook for 3-5 minutes when ready to use."
    },
    {
      id: "tea32",
      name: "Sea Salt Cheese Cap Black Tea",
      description: "Excellent pairing of sweet-salty cheese cap and rich black tea, rich in layers.",
      imageUrl: "https://th.bing.com/th/id/OIP.Tr0iX3Rw7raU3AO8EUpfBAHaFj?rs=1&pid=ImgDetMain",
      prepTime: 20,
      category: "Milk Cap",
      ingredients: [
        {name: "Black tea bags", amount: "2 bags"},
        {name: "Whipping cream", amount: "100ml"},
        {name: "Cream cheese", amount: "30g"},
        {name: "Milk", amount: "50ml"},
        {name: "Sea salt", amount: "a pinch"}
      ],
      steps: [
        "Steep black tea bags in hot water for 5 minutes, remove bags and cool",
        "Soften cream cheese in a water bath",
        "Whip cream until 60% stiff, add cream cheese, milk and sea salt, continue whipping",
        "Pour cooled black tea into cup",
        "Slowly pour in cheese cap to create layered effect"
      ],
      tips: "Whip the cap to yogurt-like consistency for best results; too thin will sink, too thick won't blend with tea."
    },
    {
      id: "tea33",
      name: "Lime Mint Sparkling Tea",
      description: "Refreshing combination of fresh lime and mint, with stimulating sensation from sparkling water.",
      imageUrl: "https://th.bing.com/th/id/OIP.EYpbWdzDKaqw6rZUYJ66fwHaHa?rs=1&pid=ImgDetMain",
      prepTime: 10,
      category: "Sparkling Tea",
      ingredients: [
        {name: "Lime", amount: "1 piece"},
        {name: "Mint leaves", amount: "10 leaves"},
        {name: "Green tea", amount: "200ml"},
        {name: "Sparkling water", amount: "100ml"},
        {name: "Honey", amount: "1 tablespoon"}
      ],
      steps: [
        "Slice lime, gently rub mint leaves to release aroma",
        "Put lime slices and mint leaves in cup",
        "Pour in cooled green tea and honey, stir well",
        "Finally add sparkling water",
        "Add ice cubes for extra refreshment"
      ],
      tips: "Add sparkling water last to maintain bubbles, healthier to make your own with a soda machine."
    },
    {
      id: "tea34",
      name: "Brown Sugar Ginger Milk Curd",
      description: "Upgraded version of traditional Cantonese dessert, perfect balance of brown sugar sweetness and ginger spiciness.",
      imageUrl: "https://example.com/black-sugar-ginger-milk.jpg",
      prepTime: 15,
      category: "Health Tea",
      ingredients: [
        {name: "Old ginger", amount: "50g"},
        {name: "Whole milk", amount: "200ml"},
        {name: "Brown sugar", amount: "30g"},
        {name: "Water", amount: "20ml"}
      ],
      steps: [
        "Grate old ginger and squeeze out juice, about 15ml",
        "Cook brown sugar with water to make syrup",
        "Heat milk to about 80°C",
        "Put ginger juice in cup first",
        "Pour hot milk from height into ginger juice",
        "Finally drizzle brown sugar syrup on top"
      ],
      tips: "Fresh old ginger works best, temperature control at 75-80°C most easily succeeds in solidifying."
    },
    {
      id: "tea35",
      name: "Oolong Milk Cap Tea",
      description: "Rich oolong tea base topped with silky milk cap, perfect fusion of tea and milk aroma.",
      imageUrl: "https://th.bing.com/th/id/OIP.BAeLxcwO82JL6Fv_DswrEAHaHa?rs=1&pid=ImgDetMain",
      prepTime: 20,
      category: "Milk Cap Tea",
      ingredients: [
        {name: "Oolong tea leaves", amount: "5g"},
        {name: "Whipping cream", amount: "100ml"},
        {name: "Cream cheese", amount: "30g"},
        {name: "Sea salt", amount: "a pinch"},
        {name: "Syrup", amount: "15ml"}
      ],
      steps: [
        "Brew oolong tea with 90°C water for 3 minutes, cool",
        "Whip cream until 60% stiff, add cream cheese, sea salt and syrup, continue whipping",
        "Pour cooled oolong tea into cup",
        "Slowly pour in milk cap to create layered effect"
      ],
      tips: "Don't whip the cap too stiff, maintain a flowing texture for better taste."
    },
];

export default bubbleTeaData;