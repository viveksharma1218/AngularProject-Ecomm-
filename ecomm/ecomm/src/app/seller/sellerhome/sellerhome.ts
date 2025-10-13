import { Component,OnInit,signal } from '@angular/core';
import { SellerAddProduct } from '../../services/seller-add-product';
import { product } from '../../interfaces/sellerAuth-interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan,faEdit} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'ec-sellerhome',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './sellerhome.html',
  styleUrl: './sellerhome.css'
})
export class Sellerhome implements OnInit{
  productList= signal<undefined | product[]>([])
  deleteMessage = signal<boolean>(false);
  deleteId = signal(0);
  Icon = faTrashCan;
  editIcon = faEdit;
  constructor(private sellerProductServ:SellerAddProduct){}

  ngOnInit(): void {
      this.generateList();
  }
  deleteProduct(id:number){
    this.deleteMessage.set(true);
    this.deleteId.set(id);
    console.log(id)
    console.log(this.deleteId())
  }
  continue(){
    this.sellerProductServ.deleteProduct(this.deleteId()).subscribe({
      next: () => {
            console.log(`Product deleted successfully (ID: ${this.deleteId()})`);
            
            // 1. Reset local component state (dialog/ID).
            this.deleteMessage.set(false);
            this.deleteId.set(0);

            // 2. Refresh the list.
            // NOTE: Since your service (product.service.ts) already calls 
            // this.loadProductList() inside the delete method's tap operator, 
            // this manual call might be redundant, but it ensures the component's 
            // local list state is updated if generateList() has other logic.
            this.generateList(); 
        },

        // Always handle errors
        error: (err) => {
            console.error('Error during product deletion:', err);
            // Optionally: show a user-friendly error message here
        }
    }
    )
   
  }
  cancal(){
    this.deleteMessage.set(false);
    this.deleteId.set(0);
    console.log(this.deleteId())
  }
  generateList(){
    this.sellerProductServ.productList().subscribe((data)=>{
        this.productList.set(data)
      })
  }
}
// const productList = [
//{
//         "id": 1,
//         "name": "Zenith Pro Laptop 14-inch",
//         "price": 1199.99,
//         "category": "Electronics",
//         "color": "Space Gray",
//         "imageUrl": "https://placehold.co/600x400/1E3A8A/ffffff?text=Zenith+Laptop",
//         "description": "Ultra-thin laptop with M3 chip, 16GB RAM, and 512GB SSD. Perfect for creative professionals."
//     },
//     {
//         "id": 2,
//         "name": "Aura Noise-Cancelling Headphones",
//         "price": 249.50,
//         "category": "Electronics",
//         "color": "Midnight Blue",
//         "imageUrl": "https://placehold.co/600x400/991B1C/ffffff?text=Aura+Headphones",
//         "description": "Industry-leading noise cancellation with 30 hours of playback."
//     },
//     {
//         "id": 3,
//         "name": "Chrono Smartwatch Series 7",
//         "price": 399.00,
//         "category": "Electronics",
//         "color": "Starlight",
//         "imageUrl": "https://placehold.co/600x400/059669/ffffff?text=Chrono+Watch",
//         "description": "Always-on retina display and comprehensive health tracking features."
//     },
//     {
//         "id": 4,
//         "name": "4K Quantum LED 55-inch TV",
//         "price": 799.99,
//         "category": "Electronics",
//         "color": "Black",
//         "imageUrl": "https://placehold.co/600x400/000000/ffffff?text=4K+QLED+TV",
//         "description": "Stunning color depth and contrast with built-in smart capabilities."
//     },
//     {
//         "id": 5,
//         "name": "Pocket Power Bank 10000mAh",
//         "price": 35.95,
//         "category": "Electronics",
//         "color": "Matte Black",
//         "imageUrl": "https://placehold.co/600x400/5B21B6/ffffff?text=Power+Bank",
//         "description": "Compact and fast charging external battery for all mobile devices."
//     },
//     {
//         "id": 6,
//         "name": "Wireless Mechanical Keyboard",
//         "price": 95.00,
//         "category": "Electronics",
//         "color": "White",
//         "imageUrl": "https://placehold.co/600x400/D97706/ffffff?text=Mechanical+KB",
//         "description": "Tactile key switches with customizable RGB backlighting."
//     },
//     {
//         "id": 7,
//         "name": "Ebook Reader 8GB",
//         "price": 129.99,
//         "category": "Electronics",
//         "color": "Graphite",
//         "imageUrl": "https://placehold.co/600x400/10B981/ffffff?text=Ebook+Reader",
//         "description": "Glare-free screen perfect for reading outdoors."
//     },
//     {
//         "id": 8,
//         "name": "Premium Desktop Monitor 27-inch",
//         "price": 450.00,
//         "category": "Electronics",
//         "color": "Silver",
//         "imageUrl": "https://placehold.co/600x400/DC2626/ffffff?text=Desktop+Monitor",
//         "description": "High refresh rate monitor suitable for gaming and design work."
//     },
//     {
//         "id": 9,
//         "name": "Portable Bluetooth Speaker",
//         "price": 65.49,
//         "category": "Electronics",
//         "color": "Ocean Teal",
//         "imageUrl": "https://placehold.co/600x400/9333EA/ffffff?text=Bluetooth+Speaker",
//         "description": "Waterproof and durable speaker with powerful bass."
//     },
//     {
//         "id": 10,
//         "name": "Webcam 1080p HD",
//         "price": 49.99,
//         "category": "Electronics",
//         "color": "White",
//         "imageUrl": "https://placehold.co/600x400/065F46/ffffff?text=HD+Webcam",
//         "description": "Clear video and integrated microphone for video calls."
//     },
//     {
//         "id": 11,
//         "name": "Classic Denim Jacket",
//         "price": 75.00,
//         "category": "Apparel",
//         "color": "Washed Blue",
//         "imageUrl": "https://placehold.co/600x400/1D4ED8/ffffff?text=Denim+Jacket",
//         "description": "Timeless style, made from sustainable cotton blend."
//     },
//     {
//         "id": 12,
//         "name": "Organic Cotton T-Shirt",
//         "price": 25.00,
//         "category": "Apparel",
//         "color": "Forest Green",
//         "imageUrl": "https://placehold.co/600x400/047857/ffffff?text=Cotton+Tee",
//         "description": "Soft, breathable, and ethically sourced material."
//     },
//     {
//         "id": 13,
//         "name": "Slim Fit Chinos",
//         "price": 55.99,
//         "category": "Apparel",
//         "color": "Khaki",
//         "imageUrl": "https://placehold.co/600x400/84CC16/ffffff?text=Slim+Chinos",
//         "description": "Versatile pants, perfect for casual and semi-formal occasions."
//     },
//     {
//         "id": 14,
//         "name": "Running Shoes - Performance",
//         "price": 110.00,
//         "category": "Apparel",
//         "color": "Neon Yellow",
//         "imageUrl": "https://placehold.co/600x400/F97316/ffffff?text=Running+Shoes",
//         "description": "Lightweight design with energy-return cushioning."
//     },
//     {
//         "id": 15,
//         "name": "Wool Blend Scarf",
//         "price": 39.50,
//         "category": "Apparel",
//         "color": "Crimson Red",
//         "imageUrl": "https://placehold.co/600x400/B91C1C/ffffff?text=Wool+Scarf",
//         "description": "Warm and soft scarf, ideal for winter weather."
//     },
//     {
//         "id": 16,
//         "name": "Stripe Knit Sweater",
//         "price": 68.00,
//         "category": "Apparel",
//         "color": "Beige/Black",
//         "imageUrl": "https://placehold.co/600x400/78716C/ffffff?text=Knit+Sweater",
//         "description": "Heavy-gauge knit, relaxed fit, and modern stripes."
//     },
//     {
//         "id": 17,
//         "name": "Leather Belt - Reversible",
//         "price": 45.00,
//         "category": "Apparel",
//         "color": "Brown/Black",
//         "imageUrl": "https://placehold.co/600x400/44403C/ffffff?text=Leather+Belt",
//         "description": "Genuine leather with a rotating buckle for two color options."
//     },
//     {
//         "id": 18,
//         "name": "High-Waisted Leggings",
//         "price": 30.00,
//         "category": "Apparel",
//         "color": "Heather Grey",
//         "imageUrl": "https://placehold.co/600x400/A78BFA/ffffff?text=Leggings",
//         "description": "Moisture-wicking fabric suitable for yoga and gym workouts."
//     },
//     {
//         "id": 19,
//         "name": "Formal Button-Down Shirt",
//         "price": 49.99,
//         "category": "Apparel",
//         "color": "Sky Blue",
//         "imageUrl": "https://placehold.co/600x400/3B82F6/ffffff?text=Formal+Shirt",
//         "description": "Wrinkle-resistant fabric, perfect for business wear."
//     },
//     {
//         "id": 20,
//         "name": "Summer Fedora Hat",
//         "price": 22.50,
//         "category": "Apparel",
//         "color": "Natural Straw",
//         "imageUrl": "https://placehold.co/600x400/FBBF24/ffffff?text=Fedora+Hat",
//         "description": "Lightweight and breathable straw hat for maximum sun protection."
//     },
//     {
//         "id": 21,
//         "name": "Espresso Maker - Automatic",
//         "price": 299.99,
//         "category": "Home Goods",
//         "color": "Stainless Steel",
//         "imageUrl": "https://placehold.co/600x400/9CA3AF/ffffff?text=Espresso+Maker",
//         "description": "One-touch operation for lattes, cappuccinos, and espresso."
//     },
//     {
//         "id": 22,
//         "name": "Weighted Throw Blanket",
//         "price": 85.00,
//         "category": "Home Goods",
//         "color": "Dusty Rose",
//         "imageUrl": "https://placehold.co/600x400/F472B6/ffffff?text=Weighted+Blanket",
//         "description": "15lb blanket designed for deep, restorative sleep."
//     },
//     {
//         "id": 23,
//         "name": "Mid-Century Floor Lamp",
//         "price": 125.00,
//         "category": "Home Goods",
//         "color": "Brass",
//         "imageUrl": "https://placehold.co/600x400/A16207/ffffff?text=Floor+Lamp",
//         "description": "Adjustable reading arm with a marble base."
//     },
//     {
//         "id": 24,
//         "name": "Set of 4 Bamboo Cutting Boards",
//         "price": 45.99,
//         "category": "Home Goods",
//         "color": "Natural Wood",
//         "imageUrl": "https://placehold.co/600x400/65A30D/ffffff?text=Cutting+Boards",
//         "description": "Eco-friendly, durable, and naturally antimicrobial bamboo."
//     },
//     {
//         "id": 25,
//         "name": "Geometric Area Rug (8x10)",
//         "price": 199.00,
//         "category": "Home Goods",
//         "color": "Grey/Yellow",
//         "imageUrl": "https://placehold.co/600x400/374151/ffffff?text=Area+Rug",
//         "description": "Modern geometric design, stain-resistant polyester fibers."
//     },
//     {
//         "id": 26,
//         "name": "Smart Air Purifier HEPA",
//         "price": 175.50,
//         "category": "Home Goods",
//         "color": "White",
//         "imageUrl": "https://placehold.co/600x400/E5E7EB/000000?text=Air+Purifier",
//         "description": "Removes 99.97% of airborne particles, controllable via app."
//     },
//     {
//         "id": 27,
//         "name": "Ceramic Dinnerware Set (4 Place Settings)",
//         "price": 79.99,
//         "category": "Home Goods",
//         "color": "Matte White",
//         "imageUrl": "https://placehold.co/600x400/F3F4F6/000000?text=Dinnerware+Set",
//         "description": "Dishwasher and microwave safe stoneware with a minimalist look."
//     },
//     {
//         "id": 28,
//         "name": "Digital Kitchen Scale",
//         "price": 29.95,
//         "category": "Home Goods",
//         "color": "Silver",
//         "imageUrl": "https://placehold.co/600x400/6B7280/ffffff?text=Kitchen+Scale",
//         "description": "High-precision sensor measures up to 10kg."
//     },
//     {
//         "id": 29,
//         "name": "Velvet Accent Pillow",
//         "price": 22.00,
//         "category": "Home Goods",
//         "color": "Mustard Yellow",
//         "imageUrl": "https://placehold.co/600x400/F59E0B/ffffff?text=Accent+Pillow",
//         "description": "Soft velvet cover with feather-filled insert."
//     },
//     {
//         "id": 30,
//         "name": "Insulated Blackout Curtains",
//         "price": 55.00,
//         "category": "Home Goods",
//         "color": "Charcoal Grey",
//         "imageUrl": "https://placehold.co/600x400/4B5563/ffffff?text=Blackout+Curtains",
//         "description": "Blocks 100% of sunlight and helps regulate room temperature."
//     },
//     {
//         "id": 31,
//         "name": "The Silent Witness (Paperback Novel)",
//         "price": 15.99,
//         "category": "Books",
//         "color": "Multi-color Cover",
//         "imageUrl": "https://placehold.co/600x400/BE185D/ffffff?text=Crime+Novel",
//         "description": "A gripping thriller about a cold case investigator."
//     },
//     {
//         "id": 32,
//         "name": "Introduction to JavaScript (Textbook)",
//         "price": 59.95,
//         "category": "Books",
//         "color": "Blue Cover",
//         "imageUrl": "https://placehold.co/600x400/38BDF8/ffffff?text=JS+Textbook",
//         "description": "Comprehensive guide for beginners covering ES6+ features."
//     },
//     {
//         "id": 33,
//         "name": "World History Atlas (Hardcover)",
//         "price": 35.00,
//         "category": "Books",
//         "color": "Gold/Brown",
//         "imageUrl": "https://placehold.co/600x400/7C2D12/ffffff?text=History+Atlas",
//         "description": "Detailed maps and timelines spanning ancient to modern eras."
//     },
//     {
//         "id": 34,
//         "name": "Vinyl LP: Jazz Classics",
//         "price": 29.99,
//         "category": "Media",
//         "color": "Black Vinyl",
//         "imageUrl": "https://placehold.co/600x400/1F2937/ffffff?text=Jazz+Vinyl",
//         "description": "Audiophile quality pressing of essential 20th-century jazz recordings."
//     },
//     {
//         "id": 35,
//         "name": "The Art of Slow Living (Self-Help)",
//         "price": 18.50,
//         "category": "Books",
//         "color": "Pastel Green",
//         "imageUrl": "https://placehold.co/600x400/A3E635/000000?text=Slow+Living+Book",
//         "description": "A guide to mindfulness and intentional lifestyle design."
//     },
//     {
//         "id": 36,
//         "name": "Children's Picture Book: Animals",
//         "price": 9.99,
//         "category": "Books",
//         "color": "Bright Yellow",
//         "imageUrl": "https://placehold.co/600x400/FCD34D/000000?text=Kids+Book",
//         "description": "Durable board book with colorful illustrations for toddlers."
//     },
//     {
//         "id": 37,
//         "name": "Cookbook: Italian Home Cooking",
//         "price": 24.95,
//         "category": "Books",
//         "color": "Red/White",
//         "imageUrl": "https://placehold.co/600x400/DC2626/ffffff?text=Cookbook",
//         "description": "Over 150 authentic and simple Italian recipes."
//     },
//     {
//         "id": 38,
//         "name": "Sci-Fi Comic Collection Vol. 1",
//         "price": 19.99,
//         "category": "Media",
//         "color": "Dark Purple",
//         "imageUrl": "https://placehold.co/600x400/8B5CF6/ffffff?text=Comic+Book",
//         "description": "First edition print collecting 10 groundbreaking sci-fi stories."
//     },
//     {
//         "id": 39,
//         "name": "Poetry Anthology: Modern Voices",
//         "price": 14.00,
//         "category": "Books",
//         "color": "Cream",
//         "imageUrl": "https://placehold.co/600x400/F5F5DC/000000?text=Poetry+Book",
//         "description": "A curated collection of contemporary poetry."
//     },
//     {
//         "id": 40,
//         "name": "Financial Literacy Guide",
//         "price": 32.00,
//         "category": "Books",
//         "color": "Orange",
//         "imageUrl": "https://placehold.co/600x400/F97316/ffffff?text=Finance+Book",
//         "description": "Understand investing, budgeting, and retirement planning basics."
//     },
//     {
//         "id": 41,
//         "name": "Two-Person Camping Tent",
//         "price": 89.99,
//         "category": "Outdoors",
//         "color": "Olive Green",
//         "imageUrl": "https://placehold.co/600x400/34D399/000000?text=Camping+Tent",
//         "description": "Lightweight and easy to set up, perfect for backpacking."
//     },
//     {
//         "id": 42,
//         "name": "Professional Yoga Mat 6mm",
//         "price": 45.00,
//         "category": "Sports",
//         "color": "Lavender",
//         "imageUrl": "https://placehold.co/600x400/C084FC/ffffff?text=Yoga+Mat",
//         "description": "Non-slip surface with superior cushioning and stability."
//     },
//     {
//         "id": 43,
//         "name": "Stainless Steel Water Bottle 32oz",
//         "price": 29.99,
//         "category": "Outdoors",
//         "color": "Matte Pink",
//         "imageUrl": "https://placehold.co/600x400/F472B6/ffffff?text=Water+Bottle",
//         "description": "Double-wall insulated, keeps drinks cold for 24 hours."
//     },
//     {
//         "id": 44,
//         "name": "Adjustable Hiking Poles (Pair)",
//         "price": 55.50,
//         "category": "Outdoors",
//         "color": "Black/Red",
//         "imageUrl": "https://placehold.co/600x400/EF4444/ffffff?text=Hiking+Poles",
//         "description": "Aluminum alloy, shock-absorbent, adjustable length."
//     },
//     {
//         "id": 45,
//         "name": "Fitness Tracker Band",
//         "price": 59.99,
//         "category": "Sports",
//         "color": "Vibrant Orange",
//         "imageUrl": "https://placehold.co/600x400/F97316/ffffff?text=Fitness+Tracker",
//         "description": "Monitors heart rate, steps, and sleep patterns."
//     },
//     {
//         "id": 46,
//         "name": "Bicycle Helmet - Ventilated",
//         "price": 69.00,
//         "category": "Sports",
//         "color": "White/Grey",
//         "imageUrl": "https://placehold.co/600x400/9CA3AF/ffffff?text=Bike+Helmet",
//         "description": "MIPS technology for superior safety, excellent airflow."
//     },
//     {
//         "id": 47,
//         "name": "Rechargeable LED Lantern",
//         "price": 39.95,
//         "category": "Outdoors",
//         "color": "Gunmetal",
//         "imageUrl": "https://placehold.co/600x400/4B5563/ffffff?text=LED+Lantern",
//         "description": "Durable and weather-resistant, 3 brightness modes."
//     },
//     {
//         "id": 48,
//         "name": "Dumbbell Set (5lb to 25lb)",
//         "price": 199.00,
//         "category": "Sports",
//         "color": "Black Rubber",
//         "imageUrl": "https://placehold.co/600x400/1F2937/ffffff?text=Dumbbell+Set",
//         "description": "Hex-shaped, rubber coated for home gym use."
//     },
//     {
//         "id": 49,
//         "name": "Portable Hammock with Stand",
//         "price": 95.00,
//         "category": "Outdoors",
//         "color": "Desert Tan",
//         "imageUrl": "https://placehold.co/600x400/FBBF24/000000?text=Hammock+Stand",
//         "description": "Sets up in minutes, perfect for patio or backyard relaxation."
//     },
//     {
//         "id": 50,
//         "name": "Jump Rope - Adjustable Speed",
//         "price": 19.99,
//         "category": "Sports",
//         "color": "Electric Blue",
//         "imageUrl": "https://placehold.co/600x400/3B82F6/ffffff?text=Jump+Rope",
//         "description": "Ball bearing system for high-speed workouts and cardio."
//     }]