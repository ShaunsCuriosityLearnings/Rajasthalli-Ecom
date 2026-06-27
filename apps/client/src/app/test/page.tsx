import { auth } from "@clerk/nextjs/server";

const TestPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  console.log(token);
  const resProduct = await fetch("http://127.0.0.1:8000/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const dataProduct = await resProduct.json();
  console.log(dataProduct);

  const resOrder = await fetch("http://127.0.0.1:8001/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const dataOrder = await resOrder.json();
  console.log(dataOrder);

  const resPayment = await fetch("http://127.0.0.1:8002/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const dataPayment = await resPayment.json();
  console.log(dataPayment);

  return <div> Testing Page services</div>;
};

export default TestPage;
