import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setPlanAmount} from '../redux/SummerySlice';
import {print} from '../utilities/helperFunction';

const UserPlanPrice = () => {
  const dispatch = useDispatch();
  const {userSettings} = useSelector(state => state.setting);

  const PlanPriceInfo = (
    planAmmount = 0,
    promo = {code: null, percent: null},
    sectionCount = '', //BN
    kms = 0,
    ifApplyAC = 'dummy',
    packagePrice = 0,
    packageName = '',
    packageCount = '', //BN
  ) => {
    const CGST = userSettings?.CGST;
    const SGST = userSettings?.SGST;

    // print(packageCount, 'pack Count');
    // print(sectionCount, 'sectionCount');
    // print(kms, 'kms');

    // helper fn for DelFee
    function findDeliveryFee(km) {
      if (
        userSettings?.delivery_fee &&
        userSettings?.delivery_fee.length > 0 &&
        km > 0
      ) {
        let fee = null;
        for (let i = 0; i < userSettings?.delivery_fee.length; i++) {
          // console.log(km, userSettings?.delivery_fee[i].kilometer, 'kms');
          // console.log(km <= userSettings?.delivery_fee[i].kilometer, 'km---');
          if (km <= userSettings?.delivery_fee[i].kilometer) {
            print(userSettings?.delivery_fee[i].fee, 'fee');
            fee = userSettings?.delivery_fee[i].fee;
            break; // Exit loop after finding the first matching range
          }
        }
        // print(fee, 'delfee');
        return fee; // Return the fee after the loop completes
      } else {
        return 0;
      }
    }
    print(findDeliveryFee(Number(kms)), 'delivery price');
    if (planAmmount > 0) {
      let subTotal = planAmmount;
      let discount = promo.percent ? subTotal * (promo.percent / 100) : null;
      let cursubtotal = discount ? subTotal - discount : subTotal;
      let sgst = Number(cursubtotal * (SGST / 100));
      let cgst = Number(cursubtotal * (CGST / 100));
      let taxAmount = sgst + cgst;
      let section_Count = sectionCount; //BN
      let dish_Count = packageCount;
      let km = kms;
      let delfee =
        cursubtotal > 0 && ifApplyAC === 'checkDistance'
          ? kms <= 1
            ? 0
            : findDeliveryFee(Number(kms)) * section_Count
          : 0;
      let delfeePerSection =
        cursubtotal > 0 && ifApplyAC === 'checkDistance'
          ? kms <= 1
            ? 0
            : findDeliveryFee(Number(kms))
          : 0;
      let vesselPrice = packagePrice;
      let vesselName = packageName;
      let totalamt =
        Number(cursubtotal) +
        Number(taxAmount) +
        Number(packagePrice) +
        Number(delfee);
      let obj = {
        subTotal: subTotal,
        sgst: sgst,
        cgst: cgst,
        sgstPercent: userSettings?.SGST,
        cgstPercent: userSettings?.CGST,
        sectionCount: section_Count,
        dishCount: dish_Count,
        delfee: delfee,
        totalamt: totalamt,
        discount: {code: promo.code, amount: discount, percent: promo.percent},
        vesselPrice: vesselPrice,
        vesselName: vesselName,
        km: km,
      };
      // minimum ammount Condition Check:
      dispatch(setPlanAmount(obj));
    }
  };

  return {PlanPriceInfo};
};

export default UserPlanPrice;

const styles = StyleSheet.create({});
