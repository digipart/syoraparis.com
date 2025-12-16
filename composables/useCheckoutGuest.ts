import { useAuth } from '~/stores/api-stores/AuthStore';
import { useCheckoutStore } from '~/stores/api-stores/CheckoutStore';
import { useAddressStore } from '~/stores/api-stores/AddressStore';
import type { AddressType } from '~/types/AddressType';

export const useCheckoutGuest = () => {
  const authStore = useAuth();
  const { isLoggedIn } = toRefs(authStore);
  const { registerGuest } = authStore;

  const checkoutStore = useCheckoutStore();
  const { checkoutCustomer, hasSameAddressForShipping } = toRefs(checkoutStore);

  const addressStore = useAddressStore();
  const { addAddress } = addressStore;

  const registerAndPrepareGuestAddress = async () => {
    if (!isLoggedIn.value) {
      await registerGuest({
        Email: checkoutCustomer.value.deliveryAddress.email,
        Firstname: checkoutCustomer.value.deliveryAddress.firstname,
        Lastname: checkoutCustomer.value.deliveryAddress.lastname,
        Guest: true,
        Address1: checkoutCustomer.value.deliveryAddress.address,
        Postcode: checkoutCustomer.value.deliveryAddress.postalCode,
        City: checkoutCustomer.value.deliveryAddress.city,
        CountryIsoCode: checkoutCustomer.value.deliveryAddress.country,
        MobilePhone: checkoutCustomer.value.deliveryAddress.phone,
        IsInvoice: hasSameAddressForShipping.value,
        IsDelivery: true,
      });

      if (!hasSameAddressForShipping.value) {
        const address = {} as AddressType;
        address.Firstname = checkoutCustomer.value.invoiceAddress.firstname;
        address.Lastname = checkoutCustomer.value.invoiceAddress.lastname;
        address.Address1 = checkoutCustomer.value.invoiceAddress.address;
        address.Postcode = checkoutCustomer.value.invoiceAddress.postalCode;
        address.City = checkoutCustomer.value.invoiceAddress.city;
        address.CountryIsoCode = checkoutCustomer.value.invoiceAddress.country;
        address.MobilePhone = checkoutCustomer.value.invoiceAddress.phone;
        address.IsDelivery = false;
        address.IsInvoice = true;
        await addAddress(address);
      }
    }
  };

  return { registerAndPrepareGuestAddress };
};
