import { Product, AppSettings, Stats, Coupon } from '../types';
import { db } from './firebase';
import firebase from "firebase/compat/app";

export const INITIAL_PRODUCTS: Product[] = [
  // --- Cupcakes ---
  {
    id: 'c1',
    name: 'Oreo Cupcake',
    description: 'A soft, moist chocolate cupcake topped with creamy Oreo frosting.',
    price: 250,
    salePrice: 200,
    category: 'Cupcakes',
    image: 'https://images.unsplash.com/photo-1595188619379-31741db45714?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true
  },
  {
    id: 'c2',
    name: 'Red Velvet Cupcake',
    description: 'A rich, velvety cupcake with a hint of cocoa.',
    price: 250,
    category: 'Cupcakes',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  announcement: {
    text: "GRAND OPENING SPECIAL: 20% OFF ALL ORDERS",
    active: true,
    isMarquee: true
  },
  hero: {
    title: "Sweetness, Elevated.",
    subtitle: "Experience the art of baking.",
    price: 250,
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=800",
    linkedProductId: 'c2'
  }
};

// --- Products ---

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await db.collection("products").get();
    if (querySnapshot.empty) {
      return INITIAL_PRODUCTS;
    }
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    // Sort by displayOrder (ascending). Products without displayOrder go to the end.
    return products.sort((a, b) => {
      const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return INITIAL_PRODUCTS;
  }
};

export const saveProducts = async (products: Product[]) => {
  try {
    const batch = db.batch();
    const snapshot = await db.collection("products").get();
    const existingIds = new Set(snapshot.docs.map(d => d.id));
    const newIds = new Set(products.map(p => p.id));

    snapshot.docs.forEach(d => {
      if (!newIds.has(d.id)) batch.delete(d.ref);
    });

    products.forEach(product => {
      const docRef = db.collection("products").doc(product.id);
      batch.set(docRef, product);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error saving products:", error);
    throw error;
  }
};

// --- Settings ---

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const docRef = db.collection("config").doc("main_settings");
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      // Deep merge to ensure structure exists even if DB data is partial
      return {
        announcement: {
          ...INITIAL_SETTINGS.announcement,
          ...(data?.announcement || {})
        },
        hero: {
          ...INITIAL_SETTINGS.hero,
          ...(data?.hero || {})
        }
      };
    }
    return INITIAL_SETTINGS;
  } catch (error) {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = async (settings: AppSettings) => {
  try {
    const docRef = db.collection("config").doc("main_settings");
    await docRef.set(settings);
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

// --- Stats & Analytics ---

export const incrementVisit = async () => {
  try {
    const statsRef = db.collection("stats").doc("general");
    await statsRef.set({
      totalVisits: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
  } catch (e) {
    console.error("Error incrementing visits", e);
  }
};

export const incrementLeads = async () => {
  try {
    const statsRef = db.collection("stats").doc("general");
    await statsRef.set({
      leadsGenerated: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
  } catch (e) {
    console.error("Error incrementing leads", e);
  }
};

export const getStats = async (): Promise<Stats> => {
  try {
    const statsSnap = await db.collection("stats").doc("general").get();
    const productsSnap = await db.collection("products").get();

    const data = statsSnap.data() || { totalVisits: 0, leadsGenerated: 0 };

    return {
      totalVisits: data.totalVisits || 0,
      leadsGenerated: data.leadsGenerated || 0,
      activeProducts: productsSnap.size
    };
  } catch (e) {
    return { totalVisits: 0, leadsGenerated: 0, activeProducts: 0 };
  }
};

// --- Coupons ---

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const snap = await db.collection("coupons").get();
    return snap.docs.map(doc => doc.data() as Coupon);
  } catch (e) {
    return [];
  }
};

export const saveCoupons = async (coupons: Coupon[]) => {
  const batch = db.batch();
  const snap = await db.collection("coupons").get();

  snap.docs.forEach(d => batch.delete(d.ref));

  coupons.forEach(c => {
    const ref = db.collection("coupons").doc(c.id);
    batch.set(ref, c);
  });

  await batch.commit();
};