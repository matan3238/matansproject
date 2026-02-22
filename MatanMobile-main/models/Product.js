// מודל זה מגדיר את מבנה הנתונים והפונקציות לעבודה עם מוצרים (טלפונים)
// כרגע עובד עם נתונים בזיכרון (in-memory) - MySQL יישמר לשלב מאוחר יותר

// מערך גלובלי לאחסון המוצרים בזיכרון
// כל מוצר נשמר כאן עד שהשרת מתאתחל מחדש
let products = []; // מערך ריק להתחלה

// משתנה למעקב אחרי ה-ID הבא שיוקצה למוצר חדש
// כל מוצר חדש מקבל ID עוקב (1, 2, 3, וכו')
let nextId = 1;

class Product {
  // פונקציה לאתחול מוצרי דוגמה
  // פונקציה זו מוסיפה כמה טלפונים לדוגמה בעת הפעלת השרת
  static async initialize() {
    // בדיקה אם כבר יש מוצרים (כדי לא להוסיף כפולים)
    if (products.length > 0) {
      return; // אם כבר יש מוצרים, לא מוסיפים שוב
    }

    // מערך של מוצרי דוגמה לטעינה ראשונית
    // התמונות הן מ-Unsplash - שירות תמונות חינמי
    const sampleProducts = [
      {
        id: nextId++,
        title: 'כיסוי מגן iPhone 15',
        price: 89,
        description: 'כיסוי סיליקון מגן עם תמיכה במגנט',
        category: 'accessories',
        image: 'https://img.ksp.co.il/item/331680/b_1.jpg?v=1725789152',
        brand: 'Generic',
        model: 'Case iPhone 15',
        stock: 50,
        rating: 4.3,
        variations: {
          colors: [
            { name: 'שחור', value: 'black', image: 'https://img.ksp.co.il/item/331680/b_1.jpg?v=1725789152', priceModifier: 0 },
            { name: 'Storm Blue', value: 'storm-blue', image: 'https://img.ksp.co.il/item/331681/b_1.jpg?v=1725789298', priceModifier: 0 },
            { name: 'Clay', value: 'clay', image: 'https://img.ksp.co.il/item/331682/b_1.jpg?v=1725789371', priceModifier: 0 },
            { name: 'ורוד בהיר', value: 'light-pink', image: 'https://img.ksp.co.il/item/331683/b_1.jpg?v=1725789437', priceModifier: 0 },
            { name: 'שקוף', value: 'clear', image: 'https://img.ksp.co.il/item/331690/b_1.jpg?v=1725789805', priceModifier: 0 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Apple AirPods Pro 3',
        price: 899,
        description: 'אוזניות אלחוטיות עם ביטול רעש אקטיבי',
        category: 'accessories',
        image: 'https://img.ksp.co.il/item/410052/l_2.jpg?v=1758013812',
        brand: 'Apple',
        model: 'AirPods Pro 3',
        storage: 'N/A',
        color: 'לבן',
        stock: 30,
        rating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'iPhone 17 Pro Max',
        price: 5999,
        description: 'הטלפון החדש והמתקדם ביותר של אפל עם שבב A19 Pro, מצלמה משופרת ומסך Super Retina XDR',
        category: 'smartphones',
        image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-silver?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RVRqUkJqUGFyN1pGMnlaV3JkWU9jdjF1TmpsTkNoRVRMR1N6UXlVZFBaU0NYR1ZZZnEyMVlVQUliTThGMjNyaFFxd1ZHd3R2RmlpWk50MW5LU2N1cWNxdlBsK2ZicnRLY2oza08vTDBZeXZ3&traceId=1',
        brand: 'Apple',
        model: 'iPhone 17 Pro Max',
        stock: 20,
        rating: 4.9,
        variations: {
          colors: [
            { name: 'סילבר', value: 'silver', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-silver?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RVRqUkJqUGFyN1pGMnlaV3JkWU9jdjF1TmpsTkNoRVRMR1N6UXlVZFBaU0NYR1ZZZnEyMVlVQUliTThGMjNyaFFxd1ZHd3R2RmlpWk50MW5LU2N1cWNxdlBsK2ZicnRLY2oza08vTDBZeXZ3&traceId=1', priceModifier: 0 },
            { name: 'כתום קוסמי', value: 'cosmic-orange', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-cosmicorange?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RnVrUzFnTVVSUnNLVnZUWUMxNTBGaGhsQTdPYWVGbmdIenAvNE9qYmZVYVFDb1F2RTNvUEVHRkpGaGtOSVFHak5NTEhXRE11VU1QNVo2eDJsWlpuWHQyaWthYXpzcEpXMExJLy9GTE9wWkNn&traceId=1', priceModifier: 0 },
            { name: 'כחול עמוק', value: 'deep-blue', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-deepblue?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RWhhOHJGRUNHdlh6a3VuZVVqdnNrNXVHdDcxbVFRSnhaQ0pnV1pOaG5KaGhNQnJMcnc4RkxJd3ZMc3hKZVVFWHREelVULzVXd2xCbVltNVMyUXhsYlBpMEowc2xaa1ByZlpMdyt3ZFlhVkhn&traceId=1', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 },
            { name: '512GB', value: '512GB', priceModifier: 1000 },
            { name: '1TB', value: '1TB', priceModifier: 2000 },
            { name: '2TB', value: '2TB', priceModifier: 3000 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'iPhone 17 Pro',
        price: 5499,
        description: 'טלפון הדגל של אפל עם שבב A19 Pro, מצלמה משופרת ומסך Super Retina XDR',
        category: 'smartphones',
        image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-silver?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RVRqUkJqUGFyN1pGMnlaV3JkWU9jdjF1TmpsTkNoRVRMR1N6UXlVZFBaU0NYR1ZZZnEyMVlVQUliTThGMjNyaFFxd1ZHd3R2RmlpWk50MW5LU2N1cWNxdlBsK2ZicnRLY2oza08vTDBZeXZ3&traceId=1',
        brand: 'Apple',
        model: 'iPhone 17 Pro',
        stock: 15,
        rating: 4.8,
        variations: {
          colors: [
            { name: 'סילבר', value: 'silver', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-silver?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RVRqUkJqUGFyN1pGMnlaV3JkWU9jdjF1TmpsTkNoRVRMR1N6UXlVZFBaU0NYR1ZZZnEyMVlVQUliTThGMjNyaFFxd1ZHd3R2RmlpWk50MW5LU2N1cWNxdlBsK2ZicnRLY2oza08vTDBZeXZ3&traceId=1', priceModifier: 0 },
            { name: 'כתום קוסמי', value: 'cosmic-orange', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-cosmicorange?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RnVrUzFnTVVSUnNLVnZUWUMxNTBGaGhsQTdPYWVGbmdIenAvNE9qYmZVYVFDb1F2RTNvUEVHRkpGaGtOSVFHak5NTEhXRE11VU1QNVo2eDJsWlpuWHQyaWthYXpzcEpXMExJLy9GTE9wWkNn&traceId=1', priceModifier: 0 },
            { name: 'כחול עמוק', value: 'deep-blue', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-deepblue?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tUzkyK3hWak1ybHhtWDkwUXVINFc0RWhhOHJGRUNHdlh6a3VuZVVqdnNrNXVHdDcxbVFRSnhaQ0pnV1pOaG5KaGhNQnJMcnc4RkxJd3ZMc3hKZVVFWHREelVULzVXd2xCbVltNVMyUXhsYlBpMEowc2xaa1ByZlpMdyt3ZFlhVkhn&traceId=1', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 },
            { name: '512GB', value: '512GB', priceModifier: 1000 },
            { name: '1TB', value: '1TB', priceModifier: 2000 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'iPhone 17',
        price: 3499,
        description: 'האייפון 17 החדש מציע חווית משתמש חלקה וביצועים אמינים.',
        category: 'smartphones',
        image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-finish-select-202509-spaceblack?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUpaQVl1bitSNmJWZUdKdi9QZHhsQnMyOXpiUEVyWXc0UFVFMUg1R1Ztcit0SFUxZzlOYjFnK2g1TG9hVnNYcmd2S3NaRzcrU0dmYjNHTUFiMnlsWFUxSlgrVWMrMzU1OXo2c2JyNjJZTGlaMVdFU2dmejhESzZKZmZKVm4vRFY&traceId=1',
        brand: 'Apple',
        model: 'iPhone 17',
        stock: 25,
        rating: 4.7,
        variations: {
          colors: [
            { name: 'לבנדר', value: 'lavender', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-select-202509-lavender_GEO_US?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxbGoraU1aeXdWbEh0SUtyMmtxWGg5dUpDNHBIcmowQ3VoNVJwTm5xckpDV2xjZnhHRHJyenVmME5KTm9Sd1ZaU3NqbWRhTGpRM2xxVWJRWUhSaDlCQ3FTZnZjRTZTT0R6VFJnZ01JbHJqd0hlODBad1VqYUZ3RW54YkRKL2hzbXVR&traceId=1', priceModifier: 0 },
            { name: 'מרווה', value: 'sage', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-select-202509-sage_GEO_US?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxZ3VBTlNROXF1MzBwZUoyNEVtMWw3aEtLUmpmVEZhTFpRYkxNWDZBb1R3dGd2S3NaRzcrU0dmYjNHTUFiMnlsWFUxSlgrVWMrMzU1OXo2c2JyNjJZTGcvWXoydVhtUUJyekgyU21tRjFxUUM&traceId=1', priceModifier: 0 },
            { name: 'כחול אובך', value: 'mist-blue', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-select-202509-mistblue_GEO_US?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxcFYyWWhPSUg0YytZdmJ2dmY4d09xckN0VFdyaFlNakY5MGMxMWhINEhMWmxjZnhHRHJyenVmME5KTm9Sd1ZaU3NqbWRhTGpRM2xxVWJRWUhSaDlCQ3JHYmE3Q0tucGdwdjhDQ1JZbjRxQXRka0xmckVNVTBkS20yTzkwa0dhU09n&traceId=1', priceModifier: 0 },
            { name: 'לבן', value: 'white', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-select-202509-white_GEO_US?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxclZmSzgzdlhzQS95ekpRalhXU0JMVkRQR0pzaFhHemZ3ZzZNcDlHRHpJYnF2TWlpSzUzejRCZGt2SjJUNGl1VEE4bm1RcmlWRWp2eDN1WHNkSjNmUmFBdlBzZ01jTzlOOGhYc3dpcENYM2Y&traceId=1', priceModifier: 0 },
            { name: 'שחור', value: 'black', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-finish-select-202509-black_GEO_US?wid=5120&hei=2880&fmt=webp&qlt=90&.v=WGdCRlQ0YVlqbTdXTEkxRnVQb0oxa3pYQjBteGp2cFFHL09TNGhVUUhxeHFkSUJZcmNjVXZ4cDk3YTVMcWk4SHF2TWlpSzUzejRCZGt2SjJUNGl1VEE4bm1RcmlWRWp2eDN1WHNkSjNmUlkwQ2hTNHZjREFYdVBRanJ6N1p0WHI&traceId=1', priceModifier: 100 }
          ],
          storage: [
            { name: '128GB', value: '128gb', priceModifier: 0 },
            { name: '256GB', value: '256gb', priceModifier: 150 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'iPhone Air',
        price: 2999,
        description: 'האייפון אייר החדש - קל משקל, עוצמתי ובעיצוב מרהיב.',
        category: 'smartphones',
        image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-finish-select-202509-skyblue?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUpaQVl1bitSNmJWZUdKdi9QZHhsQnMyOXpiUEVyWXc0UFVFMUg1R1ZtcnR3aXI2UmJNYjhmODd5OGtKRlJRN0FLaEM4VGVnOFFZVWtXR1EwaEFhTTB3c2RZTXk1UXcvbG5ySGFWbG1kZTE1Y2l3SHZ0NkJ3ek5MejNZaktIRFA&traceId=1',
        brand: 'Apple',
        model: 'iPhone Air',
        stock: 30,
        rating: 4.6,
        variations: {
          colors: [
            { name: 'תכלת', value: 'sky-blue', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-finish-select-202509-skyblue?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUpaQVl1bitSNmJWZUdKdi9QZHhsQnMyOXpiUEVyWXc0UFVFMUg1R1ZtcnR3aXI2UmJNYjhmODd5OGtKRlJRN0FLaEM4VGVnOFFZVWtXR1EwaEFhTTB3c2RZTXk1UXcvbG5ySGFWbG1kZTE1Y2l3SHZ0NkJ3ek5MejNZaktIRFA&traceId=1', priceModifier: 0 },
            { name: 'זהב בהיר', value: 'light-gold', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-finish-select-202509-lightgold?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUpaQVl1bitSNmJWZUdKdi9QZHhsQnMyOXpiUEVyWXc0UFVFMUg1R1ZtcGFDdFMvVG1KZ1loaks5VzlLRGZIZkpFd0xhWDVibStLdGRYRmxkNGI4VTR2UjRaSC9URTlmd0FSb1ZTWjRnb3NmclJJZnl5SmNFYUJGS2w3dHkrT2M&traceId=1', priceModifier: 0 },
            { name: 'לבן ענן', value: 'cloud-white', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-finish-select-202509-cloudwhite?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUpaQVl1bitSNmJWZUdKdi9QZHhsQnMyOXpiUEVyWXc0UFVFMUg1R1ZtcC9Jb0ZoZTZNQ2p1aEdieGdVdmJWZWd2S3NaRzcrU0dmYjNHTUFiMnlsWFUxSlgrVWMrMzU1OXo2c2JyNjJZTGlGd3hqTVpxNDd1K1VJKzhSUk5EaUo&traceId=1', priceModifier: 0 },
            { name: 'שחור חלל', value: 'space-black', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-air-finish-select-202509-spaceblack?wid=5120&hei=2880&fmt=webp&qlt=90&.v=NUpaQVl1bitSNmJWZUdKdi9QZHhsQnMyOXpiUEVyWXc0UFVFMUg1R1Ztcit0SFUxZzlOYjFnK2g1TG9hVnNYcmd2S3NaRzcrU0dmYjNHTUFiMnlsWFUxSlgrVWMrMzU1OXo2c2JyNjJZTGlaMVdFU2dmejhESzZKZmZKVm4vRFY&traceId=1', priceModifier: 100 }
          ],
          storage: [
            { name: '128GB', value: '128gb', priceModifier: 0 },
            { name: '256GB', value: '256gb', priceModifier: 150 },
            { name: '512GB', value: '512gb', priceModifier: 350 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Samsung Galaxy S25 Ultra',
        price: 5499,
        description: 'טלפון הדגל של סמסונג עם מסך Dynamic AMOLED 6.9 אינץ\' ומצלמה 200MP',
        category: 'smartphones',
        image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s938-sm-s938bzbomec-544702277?imbypass=true',
        brand: 'Samsung',
        model: 'Galaxy S25 Ultra',
        stock: 18,
        rating: 4.8,
        variations: {
          colors: [
            { name: 'כחול', value: 'blue', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s938-sm-s938bzbomec-544702277?imbypass=true', priceModifier: 0 },
            { name: 'אפור', value: 'gray', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s938-sm-s938bztomec-544702536?imbypass=true', priceModifier: 0 },
            { name: 'שחור', value: 'black', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s938-sm-s938bzkomec-544702351?imbypass=true', priceModifier: 0 },
            { name: 'לבן', value: 'white', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s938-sm-s938bzsomec-544702462?imbypass=true', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 },
            { name: '512GB', value: '512GB', priceModifier: 1000 },
            { name: '1TB', value: '1TB', priceModifier: 2000 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Samsung Galaxy S25 Plus',
        price: 4499,
        description: 'טלפון דגל עם מסך AMOLED 6.7 אינץ\' וביצועים חזקים',
        category: 'smartphones',
        image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s938-sm-s938bzsomec-544702462?imbypass=true',
        brand: 'Samsung',
        model: 'Galaxy S25 Plus',
        stock: 20,
        rating: 4.7,
        variations: {
          colors: [
            { name: 'כחול', value: 'blue', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s938-sm-s938bzsomec-544702462?imbypass=true', priceModifier: 0 },
            { name: 'תכלת', value: 'light-blue', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s936-sm-s936blbomec-544668794?imbypass=true', priceModifier: 0 },
            { name: 'כסף', value: 'silver', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s936-sm-s936bzsomec-544668946?imbypass=true', priceModifier: 0 },
            { name: 'ירוק', value: 'green', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s936-sm-s936blgomec-544668870?imbypass=true', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 },
            { name: '512GB', value: '512GB', priceModifier: 800 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Samsung Galaxy S25',
        price: 3999,
        description: 'טלפון דגל עם מסך AMOLED ומצלמה משופרת',
        category: 'smartphones',
        image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s931-sm-s931bdbomec-544655841?imbypass=true',
        brand: 'Samsung',
        model: 'Galaxy S25',
        stock: 22,
        rating: 4.6,
        variations: {
          colors: [
            { name: 'כחול', value: 'blue', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s931-sm-s931bdbomec-544655841?imbypass=true', priceModifier: 0 },
            { name: 'תכלת', value: 'light-blue', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s931-sm-s931blbomec-544655879?imbypass=true', priceModifier: 0 },
            { name: 'כסף', value: 'silver', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s931-sm-s931bzsomec-544655955?imbypass=true', priceModifier: 0 },
            { name: 'ירוק', value: 'green', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/2501/gallery/il-galaxy-s25-s931-sm-s931blgomec-544655917?imbypass=true', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 },
            { name: '512GB', value: '512GB', priceModifier: 800 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Samsung Galaxy S25 Edge',
        price: 4799,
        description: 'הטלפון הדק ביותר של סמסונג עם מסך Edge מעוקל',
        category: 'smartphones',
        image: 'https://images.samsung.com/is/image/samsung/p6pim/il/ps_2504/gallery/il-galaxy-s25-s937-sm-s937bzsomec-546084474?imbypass=true',
        brand: 'Samsung',
        model: 'Galaxy S25 Edge',
        stock: 15,
        rating: 4.7,
        variations: {
          colors: [
            { name: 'כסף טיטניום', value: 'titanium-silver', image: 'https://images.samsung.com/is/image/samsung/p6pim/il/ps_2504/gallery/il-galaxy-s25-s937-sm-s937bzsomec-546084474?imbypass=true', priceModifier: 0 },
            { name: 'תכלת טיטניום', value: 'titanium-icyblue', image: 'https://images.samsung.com/il/smartphones/galaxy-s25-edge/buy/product_color_titaniumIcyblue_PC.png?imbypass=true', priceModifier: 0 },
            { name: 'שחור טיטניום', value: 'titanium-jetblack', image: 'https://images.samsung.com/il/smartphones/galaxy-s25-edge/buy/product_color_titaniumJetblack_PC.png?imbypass=true', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 },
            { name: '512GB', value: '512GB', priceModifier: 1000 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Nothing Phone A3',
        price: 1499,
        description: 'טלפון עם עיצוב ייחודי וממשק Nothing OS',
        category: 'smartphones',
        image: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0004_Phone-3a-white.png?v=1753436094&width=400&height=400&crop=center',
        brand: 'Nothing',
        model: 'Phone A3',
        stock: 25,
        rating: 4.5,
        variations: {
          colors: [
            { name: 'WHITE', value: 'white', image: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0004_Phone-3a-white.png?v=1753436094&width=400&height=400&crop=center', priceModifier: 0 },
            { name: 'BLACK', value: 'black', image: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0008_Phone-3a-black.png?v=1753436094&width=400&height=400&crop=center', priceModifier: 0 },
            { name: 'BLUE', value: 'blue', image: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0007_Phone-3a-blue.png?v=1753436094', priceModifier: 0 }
          ],
          storage: [
            { name: '128GB', value: '128GB', priceModifier: 0 },
            { name: '256GB', value: '256GB', priceModifier: 300 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Nothing Phone A3 Pro',
        price: 1899,
        description: 'גרסת הפרו עם מצלמה משופרת וביצועים חזקים יותר',
        category: 'smartphones',
        image: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0010_Phone-3a-Pro-black.png?v=1753435886',
        brand: 'Nothing',
        model: 'Phone A3 Pro',
        stock: 20,
        rating: 4.6,
        variations: {
          colors: [
            { name: 'BLACK', value: 'black', image: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0010_Phone-3a-Pro-black.png?v=1753435886', priceModifier: 0 },
            { name: 'GRAY', value: 'gray', image: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0009_Phone-3a-Pro-grey.png?v=1753435871', priceModifier: 0 }
          ],
          storage: [
            { name: '128GB', value: '128GB', priceModifier: 0 },
            { name: '256GB', value: '256GB', priceModifier: 300 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'OnePlus 13 5G',
        price: 3999,
        description: 'טלפון דגל עם טעינה מהירה ומסך Fluid AMOLED ותמיכה ב-5G',
        category: 'smartphones',
        image: 'https://one-plus.co.il/wp-content/uploads/2025/09/oneplus_13.png',
        brand: 'OnePlus',
        model: '13 5G',
        stock: 18,
        rating: 4.7,
        variations: {
          colors: [
            { name: 'BLACK', value: 'black', image: 'https://one-plus.co.il/wp-content/uploads/2025/09/oneplus_13-.png', priceModifier: 0 },
            { name: 'MIDNIGHT OCEAN', value: 'midnight-ocean', image: 'https://one-plus.co.il/wp-content/uploads/2025/09/oneplus_13.png', priceModifier: 0 },
            { name: 'ARCTIC DAWN', value: 'arctic-dawn', image: 'https://one-plus.co.il/wp-content/uploads/2025/09/oneplus_13-1.png', priceModifier: 0 },
            { name: 'BLACK ECLIPSE', value: 'black-eclipse', image: 'https://one-plus.co.il/wp-content/uploads/2025/09/oneplus_13-.png', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 },
            { name: '512GB', value: '512GB', priceModifier: 1000 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'OnePlus 13R 5G',
        price: 2999,
        description: 'טלפון ביצועים מעולים במחיר נגיש עם תמיכה ב-5G',
        category: 'smartphones',
        image: 'https://one-plus.co.il/wp-content/uploads/2025/09/86986b2f012ba6bcb58c3a9958fe57e5.webp',
        brand: 'OnePlus',
        model: '13R 5G',
        stock: 22,
        rating: 4.6,
        variations: {
          colors: [
            { name: 'ASTRAL TRAIL', value: 'astral-trail', image: 'https://one-plus.co.il/wp-content/uploads/2025/09/86986b2f012ba6bcb58c3a9958fe57e5.webp', priceModifier: 0 },
            { name: 'NEBULA NOIR', value: 'nebula-noir', image: 'https://one-plus.co.il/wp-content/uploads/2025/09/3980ae1ce71f85583b3d3cd4d3038fe3.webp', priceModifier: 0 }
          ],
          storage: [
            { name: '256GB', value: '256GB', priceModifier: 0 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'Xiaomi 15 Ultra',
        price: 4499,
        description: 'טלפון הדגל העליון עם מצלמה Leica Summilux ומסך WQHD+',
        category: 'smartphones',
        image: 'https://www.mi-il.co.il/images/site/products/ec1e9518-f607-42b8-bad2-2c34c6e58b24.jpg',
        brand: 'Xiaomi',
        model: '15 Ultra',
        stock: 15,
        rating: 4.8,
        variations: {
          colors: [
            { name: 'כסוף', value: 'silver', image: 'https://www.mi-il.co.il/images/site/products/ec1e9518-f607-42b8-bad2-2c34c6e58b24.jpg', priceModifier: 0 },
            { name: 'שחור', value: 'black', image: 'https://www.mi-il.co.il/images/site/products/ca874b6d-6c2c-47c1-a682-237646c87fe8.jpg', priceModifier: 0 },
            { name: 'לבן', value: 'white', image: 'https://www.mi-il.co.il/images/site/products/11e1de57-14ff-417a-aed6-f8196058954f.jpg', priceModifier: 0 }
          ],
          storage: [
            { name: '512GB', value: '512GB', priceModifier: 0 },
            { name: '1TB', value: '1TB', priceModifier: 1000 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'מטען מהיר 30W',
        price: 89,
        description: 'מטען מהיר USB-C עם תמיכה בטעינה מהירה עד 30W',
        category: 'accessories',
        image: 'https://img.ksp.co.il/item/406528/l_1.jpg?v=1756120140',
        brand: 'Generic',
        model: 'Fast Charger 30W',
        storage: 'N/A',
        color: 'לבן',
        stock: 100,
        rating: 4.4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'מטען אלחוטי 15W',
        price: 149,
        description: 'מטען אלחוטי מהיר עם תמיכה בטעינה עד 15W',
        category: 'accessories',
        image: 'https://img.ksp.co.il/item/304542/b_1.jpg?v=1713432626',
        brand: 'Generic',
        model: 'Wireless Charger 15W',
        storage: 'N/A',
        color: 'שחור',
        stock: 80,
        rating: 4.3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'מגן מסך מזכוכית',
        price: 49,
        description: 'מגן זכוכית מחוזק להגנה מקסימלית על המסך',
        category: 'accessories',
        image: 'https://img.ksp.co.il/item/334119/b_1.jpg?v=1726735877',
        brand: 'Generic',
        model: 'Screen Protector',
        stock: 200,
        rating: 4.5,
        variations: {
          models: [
            { name: 'iPhone 16 Pro', value: 'iphone-16-pro', priceModifier: 0 },
            { name: 'iPhone 16 Plus', value: 'iphone-16-plus', priceModifier: 0 },
            { name: 'iPhone 15 Pro', value: 'iphone-15-pro', priceModifier: 0 },
            { name: 'iPhone 15 Plus', value: 'iphone-15-plus', priceModifier: 0 },
            { name: 'iPhone 15 - iPhone 16', value: 'iphone-15-16', priceModifier: 0 },
            { name: 'iPhone 17 Pro Max', value: 'iphone-17-pro-max', priceModifier: 0 },
            { name: 'iPhone 17 Pro', value: 'iphone-17-pro', priceModifier: 0 },
            { name: 'iPhone 17', value: 'iphone-17', priceModifier: 0 },
            { name: 'iPhone Air', value: 'iphone-air', priceModifier: 0 },
            { name: 'iPhone 16 Pro Max', value: 'iphone-16-pro-max', priceModifier: 0 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: nextId++,
        title: 'מגן מסך סיליקון',
        price: 79,
        description: 'כיסוי סיליקון רך להגנה על הטלפון מפני נפילות',
        category: 'accessories',
        image: 'https://www.ivory.co.il/files/catalog/org/1746433866d66Wz.webp',
        brand: 'Generic',
        model: 'Silicone Case',
        stock: 150,
        rating: 4.2,
        variations: {
          models: [
            { name: 'Galaxy S25 Ultra', value: 'galaxy-s25-ultra', priceModifier: 0 },
            { name: 'Galaxy S25 Plus', value: 'galaxy-s25-plus', priceModifier: 0 },
            { name: 'Galaxy S25', value: 'galaxy-s25', priceModifier: 0 },
            { name: 'Galaxy S25 Edge', value: 'galaxy-s25-edge', priceModifier: 0 },
            { name: 'Galaxy S24 Ultra', value: 'galaxy-s24-ultra', priceModifier: 0 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // הוספת כל מוצרי הדוגמה למערך
    products = [...sampleProducts];
    console.log(`✅ אותחלו ${products.length} מוצרי דוגמה`); // הודעת הצלחה
  }

  // פונקציה לקבלת כל המוצרים
  // מחזירה רשימה של כל הטלפונים בחנות
  static async getAll() {
    // מחזיר עותק של המערך (לא את המקור) כדי למנוע שינויים לא מכוונים
    return [...products].sort((a, b) => {
      // מיון לפי תאריך יצירה - החדשים ביותר ראשונים
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  // פונקציה לקבלת מוצר בודד לפי ID
  // משמשת להצגת פרטי טלפון ספציפי
  static async getById(id) {
    // מחפש מוצר עם ה-ID המבוקש
    // parseInt ממיר את ה-ID למספר (אם הוא מגיע כמחרוזת מה-URL)
    const product = products.find(p => p.id === parseInt(id));
    return product || null; // מחזיר את המוצר או null אם לא נמצא
  }

  // פונקציה ליצירת מוצר חדש
  // מוסיפה טלפון חדש למערך המוצרים
  static async create(productData) {
    // יצירת אובייקט מוצר חדש עם כל הפרטים
    const newProduct = {
      id: nextId++, // הקצאת ID חדש
      title: productData.title,
      price: productData.price,
      description: productData.description || '',
      category: productData.category || 'smartphones',
      image: productData.image || '',
      brand: productData.brand || '',
      model: productData.model || '',
      storage: productData.storage || 'N/A',
      color: productData.color || '',
      stock: productData.stock || 0,
      rating: productData.rating || 0,
      variations: productData.variations || {},
      createdAt: new Date().toISOString(), // תאריך יצירה
      updatedAt: new Date().toISOString() // תאריך עדכון
    };

    // הוספת המוצר החדש למערך
    products.push(newProduct);
    return newProduct; // מחזיר את המוצר שנוצר
  }

  // פונקציה לעדכון מוצר קיים
  // מעדכנת פרטי טלפון במערך המוצרים
  static async update(id, productData) {
    // מחפש את המוצר לפי ID
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    // אם המוצר לא נמצא, מחזיר null
    if (productIndex === -1) {
      return null;
    }

    // עדכון כל השדות שנשלחו בבקשה
    Object.keys(productData).forEach(key => {
      if (productData[key] !== undefined) {
        products[productIndex][key] = productData[key]; // מעדכן את השדה
      }
    });

    // עדכון תאריך העדכון
    products[productIndex].updatedAt = new Date().toISOString();

    // מחזיר את המוצר המעודכן
    return products[productIndex];
  }

  // פונקציה למחיקת מוצר
  // מוחקת טלפון מהמערך
  static async delete(id) {
    // מחפש את המיקום של המוצר במערך
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    // אם המוצר לא נמצא, מחזיר false
    if (productIndex === -1) {
      return false;
    }

    // מוחק את המוצר מהמערך
    products.splice(productIndex, 1);
    return true; // מחזיר true אם המוצר נמחק בהצלחה
  }

  // פונקציה לחיפוש מוצרים לפי קטגוריה
  // מחזירה רק טלפונים מהקטגוריה המבוקשת
  static async getByCategory(category) {
    const filteredProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    return filteredProducts.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  // פונקציה לסינון מוצרים לפי קטגוריה, מותג ונפח אחסון
  static async getFiltered(filters = {}) {
    const { category, brand, storage } = filters;
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand) {
      filtered = filtered.filter(p => 
        (p.brand || '').toLowerCase() === brand.toLowerCase()
      );
    }

    if (storage) {
      const storageLower = storage.toLowerCase();
      filtered = filtered.filter(p => {
        if (p.storage && p.storage.toLowerCase().includes(storageLower)) return true;
        const variations = p.variations?.storage || [];
        return variations.some(s => 
          (s.value || '').toLowerCase().includes(storageLower) ||
          (s.name || '').toLowerCase().includes(storageLower)
        );
      });
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // מחזיר רשימת מותגים ייחודיים ורשימת נפחי אחסון ייחודיים
  static getFilterOptions() {
    const brands = new Set();
    const storageOptions = new Set();
    products.forEach(p => {
      if (p.brand) brands.add(p.brand);
      if (p.storage && p.storage !== 'N/A') storageOptions.add(p.storage);
      (p.variations?.storage || []).forEach(s => {
        if (s.name) storageOptions.add(s.name);
      });
    });
    const toSortValue = (s) => {
      const m = String(s).match(/(\d+)\s*(GB|TB)?/i);
      if (!m) return 0;
      let v = parseInt(m[1]) || 0;
      if ((m[2] || '').toUpperCase() === 'TB') v *= 1024;
      return v;
    };
    return {
      brands: [...brands].filter(b => b !== 'Generic').sort(),
      storage: [...storageOptions].sort((a, b) => toSortValue(a) - toSortValue(b))
    };
  }
}

module.exports = Product;
