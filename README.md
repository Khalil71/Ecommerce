# Ecommerce APIs

## Getting Started

### Prerequisites

What you need to install

```
node.js
```

### Installing dependencies

```
$ npm i
```

### To run the server

```
$ npm run start
```

## APIs

Server runs on http://localhost:3000/

### Orders APIs

#### Add order

body:
(companyName [string]: required)
(customerAddress [string]: required)
(orderedItem [string]: required)
(price [Number]: required)
(currency [string]: required) [ISO code i.e(USD, EUR)]

```
POST /orders
```

#### Show all orders from a particular company

params: (companyName [string]: required)

```
GET /orders/company/:companyName
```

#### Show all orders to a particular address

query: (customerAddress [string]: required)

```
GET /orders/address
```

#### Delete a particular order given orderId

params: (orderId [number]: required)

```
DELETE /orders/:orderId
```

#### Display how often each item has been ordered

```
GET /orders/summary
```

### Companies APIs

#### Get company info

params: (name [string]: required)

```
GET /companies/:name
```

#### Update company info

params: (name [string]: required)
body: (newName [string]: required)

```
PATCH /companies/:name
```

#### Delete company

params: (name [string]: required)

```
DELETE /companies/:name
```

#### Get company orders

params: (name [string]: required)

```
GET /companies/:name/orders
```

#### Get money paid by company

params: (name [string]: required)

```
GET /companies/:name/summary
```

#### Get all companies that bought a certain order

query: (item [string]: required)

```
GET /companies/item/info
```

## Author

* **Mohamed Hegab** - _Github link_ - [Khalil71](https://github.com/Khalil71)
