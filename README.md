# BMW iDrive Coding

A lightweight frontend app (Vue 2) for BMW iDrive coding product selection and checkout. Users enter a VIN to fetch compatible products, add them to a cart, and proceed to checkout on the webshop.

## Quick Start

1. Install Node.js (>= 18) and npm.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start a local server:
   ```bash
   npm start
   ```
4. Open the app in your browser (http-server defaults to `http://127.0.0.1:8080`).

## Project Scripts

- `npm start`: Serves the project root using `http-server`.

## Key Files

- `index.html`: App entry.
- `assets/js/app.js`: Main Vue app, VIN check, cart flow, checkout.
- `assets/js/products.js`: Product configuration and helpers.

## Purchase Flow (summary)

- Enter VIN → POST `/api2/extender/vinchck/idrive` to get compatible products.
- Add products to cart (gated until VIN is set). Minimum order: $70 (coding items only).
- If a cable-type product is selected, optional extras:
  - Coding cable (default add on checkout)
  - Ethernet adapter (Type A or C)
- Checkout: POST `/api2/cart/add` with items, then redirect to `/cart`.

## Cart Add Payload

`POST /api2/cart/add`
```json
{
  "data": [
    {
      "productId": "<shopId or code>",
      "variantId": "<variant>",
      "productName": "<name>",
      "productPrice": 123.45,
      "productIdName": "<vinCheckId or internal>",
      "dropDown": [123, 456],
      "dropDownDetails": [ ... ],
      "productIcon": "<icon>",
      "addedWifi": false,
      "warranty": 0,
      "savePrice": 0,
      "isCable": 0
    }
  ],
  "from": "idrive",
  "cartId": 0
}
```

Notes:
- For custom products, dropdowns are fetched from `/api2/product/{shopId}` and included in `dropDown`.
- If the user visits with `?cart=XXXX`, that value is used as `cartId` to append to an existing cart.

## Query Parameters

- `?vin=<VIN>`: Prefill and auto-run VIN check.
- `?cart=<ID>`: Use existing webshop cart ID when adding items.

## Tech Stack

- Vue 2, Vue Router, Axios, Moment, jQuery, Toastr, AOS
- Served via `http-server` (no build step)

## Development Notes

- Prices from VIN check are in cents and converted to dollars in the UI.
- `originalPrice` is displayed with strikethrough when higher than current price.
- Redirect after adding to cart: `/cart?cartId=<id>&from=idrive&vin=<vin>&ref=<pageUrl>`.

## License

ISC
