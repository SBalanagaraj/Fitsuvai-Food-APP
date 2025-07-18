import {useDispatch, useSelector} from 'react-redux';
import {setIfCoinApply, setTotal} from '../redux/CartSlice';
import {print} from '../utilities/helperFunction';

const useCartPriceInfo = () => {
  const dispatch = useDispatch();
  const {cart, coinHub} = useSelector(state => state.cart);
  const {userSettings} = useSelector(state => state.setting);

  const calculatePriceInfo = (
    promo = {code: null, percent: null},
    kms = 0,
    coinFee = 0,
    coinsRedeemed = 0,
    ifApplyAC = 'dummy',
    packagePrice = 0,
    packageName = '',
  ) => {
    const CGST = userSettings?.CGST;
    const SGST = userSettings?.SGST;
    const settingChargeBelow = Infinity;
    const coinsHub = coinHub;

    // helper fn for DelFee
    function findDeliveryFee(km) {
      if (
        userSettings?.delivery_fee &&
        userSettings?.delivery_fee.length > 0 &&
        km > 0
      ) {
        let fee = null;
        for (let i = 0; i < userSettings?.delivery_fee.length; i++) {
          print(userSettings?.delivery_fee[i].kilometer, 'kiloMeter');
          if (km <= userSettings?.delivery_fee[i].kilometer) {
            fee = userSettings?.delivery_fee[i].fee;
            break; // Exit loop after finding the first matching range
          } else if (km > userSettings?.delivery_fee[i].kilometer) {
            fee =
              userSettings?.delivery_fee[userSettings?.delivery_fee.length - 1]
                .fee;
          }
        }
        return fee; // Return the fee after the loop completes
      } else {
        return 0;
      }
    }

    if (cart && userSettings && userSettings.REWARD) {
      let subTotal = cart.reduce(
        (sum, item) => sum + item.offer * item.quantity,
        0,
      );
      let totalProtein = cart.reduce(
        (sum, item) => sum + item.protein * item.quantity,
        0,
      );
      let totalCalories = cart.reduce(
        (sum, item) => sum + item.calories * item.quantity,
        0,
      );
      let totalCarbs = cart.reduce(
        (sum, item) => sum + item.carbs * item.quantity,
        0,
      );
      let totalVitamins = cart.reduce(
        (sum, item) => sum + item.vitamins * item.quantity,
        0,
      );
      let totalMinerals = cart.reduce(
        (sum, item) => sum + item.minerals * item.quantity,
        0,
      );
      let totalFats = cart.reduce(
        (sum, item) => sum + item.fats * item.quantity,
        0,
      );
      let discount = promo.percent ? subTotal * (promo.percent / 100) : null;
      let cursubtotal = discount
        ? subTotal - discount
        : coinFee && subTotal >= Number(userSettings.REWARD.maximum_amount)
        ? subTotal - Number(coinFee)
        : subTotal;
      let sgst = Number(cursubtotal * (SGST / 100));
      let cgst = Number(cursubtotal * (CGST / 100));
      let taxAmount = sgst + cgst;
      let delfee =
        cursubtotal > 0 &&
        cursubtotal < settingChargeBelow &&
        ifApplyAC === 'checkDistance'
          ? kms <= 1
            ? 0
            : findDeliveryFee(Math.round(Number(kms)))
          : 0;
      let vesselPrice = packagePrice;
      let vesselName = packageName;
      let totalamt =
        cursubtotal + taxAmount + Number(packagePrice) + Number(delfee);

      let obj = {
        subTotal: subTotal,
        sgst: sgst,
        cgst: cgst,
        sgstPercent: userSettings?.SGST,
        cgstPercent: userSettings?.CGST,
        delfee: delfee,
        totalamt: totalamt,
        chargeBelow: settingChargeBelow,
        discount: {code: promo.code, amount: discount, percent: promo.percent},
        amount_reduced:
          totalamt <= userSettings && userSettings.REWARD.maximum_amount
            ? 0
            : coinFee,
        reward_percentage: userSettings && userSettings.REWARD.reward,
        reward_point: coinsHub,
        points_redeemed:
          totalamt <= userSettings && userSettings.REWARD.maximum_amount
            ? 0
            : coinsRedeemed,
        pointsShown:
          coinsRedeemed > 0 && totalamt >= userSettings?.REWARD.maximum_amount
            ? userSettings.user_points - coinsRedeemed
            : userSettings.user_points,
        vesselPrice: vesselPrice,
        vesselName: vesselName,
        kms: kms > 0 ? kms : 0, //changes,
        totalProtein,
        totalCalories,
        totalCarbs,
        totalFats,
        totalMinerals,
        totalVitamins,
      };
      // minimum ammount Condition Check:
      dispatch(setTotal(obj));
      if (
        userSettings?.REWARD &&
        Number(totalamt) > Number(userSettings?.REWARD.maximum_amount)
      ) {
        dispatch(setIfCoinApply(0));
      } else if (coinFee > 0 || discount > 0) {
        dispatch(setIfCoinApply(prev => prev + 1));
      }
    }
  };

  return {calculatePriceInfo};
};

export default useCartPriceInfo;
