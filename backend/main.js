const express = require("express");
const cors = require("cors");
require('./db/config');
const User = require("./db/User");
const product = require("./db/Product");
const jwt = require('jsonwebtoken');
const jwtkey = 'e-comm';
const app = express();
app.use(express.json());
app.use(cors());
////sign up apii (route)
app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    jwt.sign({ result }, jwtkey, (err, token) => {
        if (err) {
            resp.send({ result: "Somethinf went wrong" })
        }
        resp.send({ result, auth: token })
    })
})

/// login api(route)
app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.Email) {
        console.warn(req.body.Email);
        const user = await User.findOne(req.body).select("password");
        console.warn(user);
        if (user) {
            jwt.sign({ user }, jwtkey, (err, token) => {
                if (err) {
                    resp.send({ result: "Somethinf went wrong" })
                }
                resp.send({user,  auth: token })
            })

        } else {
            resp.send({ result: "No user found" })
        }
    } else {
        resp.send({ result: "No result found" })
    }
})


// add product api(route)
app.post("/add-product",verifyToken, async (req, resp) => {
    let Products = new product(req.body);
    let result = await Products.save();
    resp.send(result);

})
// listing products
app.get("/products", verifyToken, async (req, resp) => {
    let products = await product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: "No result found" })

    }
})
//delete api 
app.delete("/product/:id", verifyToken, async (req, resp) => {
    const result = await product.deleteOne({ _id: req.params.id })
    resp.send(result);
})
// api for updating product through id fetch data from DB
app.get("/product/:id", verifyToken,async (req, resp) => {
    let result = await product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: "No result found." })
    }
})
// api for putting updated value
app.put("/product/:id", verifyToken,async (req, resp) => {
    let result = await product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result)
});
// search api for product 
app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { price: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    resp.send(result);
})

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    console.warn("middleware is:",token)
    if (token) {
        token = token.split(' ')[1];
        console.warn("middleware called if", token);
        jwt.verify(token, jwtkey, (err, valid) => {
            if (err) {
                return res.send({ result: "please provide valid token" }); // Use return to prevent calling next()
            } else {
                next();
            }
        });
    } else {
        return res.send({ result: "please add token with header" }); // Use return to prevent calling next()
    }
}

// Make sure to define other routes after the middleware if they depend on it
app.use(verifyToken);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
