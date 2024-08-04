// payment.js
import { toast } from 'react-toastify';
import { orderService } from "../../modules/order/services/order-service";

export const payWithRazorPay = (email, name, total, address, closeModal) => {
  var options = {
    "key": "rzp_test_xQJcS49E6NLbJj", // Enter the Key ID generated from the Dashboard
    "amount": total * 100, // Amount is in currency subunits (convert to paise)
    "currency": "INR",
    "name": "Domino's", // Your business name
    "description": "Test Transaction",
    "image": "https://cdn.prod.website-files.com/5ee732bebd9839b494ff27cd/5ef0a132e152b7b29311f6c7_Dominos-Pizza-600x600.png",
    
    "handler": function (response) {
      orderService(email, response.razorpay_payment_id, 'Success', name, address, total);
      toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      console.log(response);
      closeModal();
    },
    "prefill": {
      "name": name,
      "email": email, 
      "contact": "9000090000" // Provide the customer's phone number
    },
    "notes": {
      "address": "Razorpay Corporate Office"
    },
    "theme": {
      "color": "#3399cc"
    }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
  
  rzp1.on('payment.failed', function (response) {
    toast.error(`Payment Failed! Error: ${response.error.description}`);
  });
};
