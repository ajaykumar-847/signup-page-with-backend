const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// this line is to store the css styles sheet which we have written to load in the browser
app.use(express.static("public"));

//body parser is used to get the data form the client side
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

// after user clicks the submit button this function invokes
// and the value is stored in the variables firstName, lastName, email
// with the help of body-parser
app.post("/", function (req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	// console.log(firstName,lastName,email);

	// store the data in the object format
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	// convert the data to string
	const jsonData = JSON.stringify(data);
	url = "https://us8.api.mailchimp.com/3.0/lists/e521f2e25f";

	// set the post options and authorization key
	const options = {
		method: "POST",
		auth: "apikey:a2e1cd9b3f36ad0bcb90f4fbf2a828b9-us8"
	};

	const request = https.request(url, options, function (response) {
		console.log("status code = ", response.statusCode);
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function (data) {
			console.log(JSON.parse(data));
			console.log("done boss");
		});
	});

	// comment the below line if you want to check the response status code 400
	request.write(jsonData);
	request.end();
});

// if the response is failed then redirect to the home page
app.post("/failure", function (req, res) {
	// redirect function is used to redirect to home page
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
	console.log("server started at port 3000");
});

// api key
// a2e1cd9b3f36ad0bcb90f4fbf2a828b9-us8

// list id
// e521f2e25f
