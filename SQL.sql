--Create Users Table
CREATE TABLE users(uid INT PRIMARY KEY IDENTITY(1,1),
					name VARCHAR(32) NOT NULL,
					emial  VARCHAR(64) UNIQUE NOT NULL,
					mobile VARCHAR(16) UNIQUE NOT NULL,
					password VARCHAR(128) NOT NULL,
					address nVARCHAR(max),
					token VARCHAR(128) UNIQUE,
					role SMALLINT NOT NULL,
					status SMALLINT NOT NULL
					);

ALTER TABLE users
    ADD CONSTRAINT [address record should be formatted as JSON]
                   CHECK (ISJSON(address)=1)

--nsert Data Into Users Table
  
--INSERT INTO users VALUES('name','email','mobile','password','token','isEmail verified');

INSERT INTO users VALUES('Ritesh','riteshsaini331@gmail.com','8708272170','123456','123456789','false');
INSERT INTO users VALUES('Rk','rkstucwxyz@gmail.com','8708272171','123456','123456799','false');
INSERT INTO users VALUES('RKS369','rks369@gmail.com','8708272172','123456','123456779','false');

--Display Data

SELECT * FROM users;

--Create Products Tab

CREATE TABLE products(pid INT PRIMARY KEY IDENTITY(1,1),
title VARCHAR(24) NOT NULL,
description VARCHAR (256) NOT NULL,
price INT NOT NULL,
stock INT NOT NULL,
image VARCHAR(150) NOT NULL,
seller_id INT REFERENCES users(uid),
status SMALLINT
);

--Insert Data Into Products

INSERT INTO products VALUES('IPhone',
'IPhone 13 Pro Max 256GB',
150000,
1000,
'rehgurhogerihgoie',
1,0);

--Display Data 

SELECT pid,tittle,description,price,stock,image,bussinessname
FROM products JOIN sellers ON products.seller_id=sellers.sid;

--Create Cart Table

CREATE TABLE cart(cid INT PRIMARY KEY IDENTITY(1,1),
user_id INT REFERENCES users(uid) ,
product_id INT REFERENCES products(pid),
quantity INT NOT NULL);

--Insert Data Into Cart 

INSERT INTO cart VALUES(10001,1,2);

--Display Data of Cart

SELECT pid,tittle,description,price,stock,image,quantity
FROM products JOIN cart ON products.pid = cart.product_id
WHERE user_id = 10001;

--Create WishList Table

CREATE TABLE wishlist(wlid INT PRIMARY KEY IDENTITY(1,1),
user_id INT REFERENCES users(uid) ON DELETE CASCADE,
product_id INT REFERENCES products(pid) ON DELETE CASCADE,
);
--Insert Data Into WishList

INSERT INTO wishlist VALUES(10001,1);

--Display Data Wish List

SELECT pid,tittle,description,price,stock,image
FROM products JOIN wishlist ON products.pid = wishlist.product_id
WHERE user_id = 10001;

--Create Address Table

CREATE TABLE address(aid INT PRIMARY KEY IDENTITY(1,1),
user_id INT REFERENCES users(uid) on DELETE CASCADE,
address VARCHAR(250)  NOT NULL,
pincode INT NOT NULL,
city VARCHAR(15) NOT NULL,
state VARCHAR(15) NOT NULL,
mobile VARCHAR(12) NOT NULL
);

--Insert Data Into Address

INSERT INTO address VALUES(10001,
'Street No 456',
135001,
'Yamunanagar',
'Haryana',
'8708272170'
);

INSERT INTO address VALUES(10001,
'Street No 123',
135031,
'Jagadhari',
'Haryana',
'8708272170'
);

--Displaying Data Of Address

SELECT * FROM address WHERE user_id = 10001;

--Create Order Table

CREATE TABLE orders(oid INT PRIMARY KEY IDENTITY(1,1),
user_id INT REFERENCES users(uid) ON DELETE CASCADE,
product_id INT REFERENCES products(pid),
product_title VARCHAR(50) NOT NULL,
quantity INT NOT NULL,
price INT NOT NULL,
time VARCHAR(15) NOT NULL,
billing_address INT REFERENCES address(aid),
);

--Insert Value in Orders

INSERT INTO orders VALUES(10001,1,'IPhone',1,150000,'123456789',1);

--Display Data

SELECT * FROM Orders JOIN address ON aid = billing_address


CREATE TABLE orders (order_id INT PRIMARY KEY IDENTITY(1,1),
					user_id INT REFERENCES users(uid) ,
					billing_address NVARCHAR(max) check(ISJSON(billing_address)=1),
					order_time datetime not null default(current_timestamp)) 