const stripe = require('stripe')(
	'sk_test_51J9m9RSIg4LoXiuuw1iWSM78zMHVMjIPoEE9XiRj6tqOAonCfB6iYpwR5E8OQS8y5wxTXkZefWCkowSEwmJROZv600iv9weDZD'
);
const uuid = require('uuid/v1');

exports.completePayment = async (req, res) => {
	const { products, token } = req.body;

	console.log('Product is:', products);
	console.log('Token is:', token);
	const idempotency_key = uuid();

	return stripe.customers
		.create({
			email: token.email,
			source: token.id,
		})
		.then((customer) => {
			console.log('Customer', customer);

			const charges = stripe.charges.create(
				{
					amount: products.price,
					currency: 'usd',
					customer: customer.id,
					receipt_email: token.email,
					description: `Purchase of ${products.name}`,
				},
				idempotency_key
			);

			console.log('Charges', charges);

			// .then((result) => {
			// 	console.log('Result', result);
			// 	res.status(200).json(result);
			// })
			// .catch((err) => console.log('error', err));
		});
};
