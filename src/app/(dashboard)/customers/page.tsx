import Background from "~/app/_components/background";
import CustomerList from "~/app/_components/customer/customers";

export default async function CustomersPage() {
  return (
    <Background>
      <CustomerList />
    </Background>
  );
}
