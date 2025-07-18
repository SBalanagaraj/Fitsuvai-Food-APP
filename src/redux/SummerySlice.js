import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  planDays: '',
  triggerEdit: 1,
  assesMentIds: [
    {assessmentId: ''},
    {yourMealId: ''},
    {yourGoalId: ''},
    {foodSessions: ['breakfast', 'lunch', 'dinner']},
  ],
  summeryContent: [
    {yourGoal: ''},
    {age: ''},
    {weight: ''},
    {height: ''},
    {bmi: ''},
    {yourMeal: ''},
    {context: 'save_assessment'}, //BN
    {subscriptionId: ''}, //BN
    {oneTimePurchase: ''}, //BN
    {comparisionPrice: ''},
    {activity: ''},
  ],
  planAmmount: {
    subTotal: '',
    sgst: '',
    cgst: '',
    sgstPercent: '',
    cgstPercent: '',
    dishCount: '',
    sectionCount: '',
    delfee: '',
    totalamt: '',
    discount: {code: '', amount: '', percent: ''},
    vesselPrice: '',
    vesselName: '',
    km: '',
  },
  memberShipData: {
    membership: '',
    food_session: '',
    subtotal: '',
    food_preference: '',
    goal: '',
    age: '',
    weight: '',
    height: '',
    bmi: '',
    email: '',
    name: '',
    gender: '',
    number: '',
    flatno: '',
    pincode: '',
    street: '',
    city: '',
    state: '',
    nearLocation: '',
    is_weekEnd: '',
    from_date: '',
    oil_preference: '',
    spice_preference: '',
    food_container: '',
    are_you_busy: '',
    cooking_comments: '',
    dislikes: '',
    activity: '',
    tdee: '',
    bmr: '',
    tef: '',
    proteins: '',
    carbs: '',
    fats: '',
    trainerStatus: '',
  },
  editPlanDetails: {
    vesselPrice: '',
    vesselName: '',
    distance: '',
    totalAmount: '',
    puchasedContainer: '',
    OTP_Status: '',
  },
  nutrientsList: {
    totalProtein: '',
    totalCalories: '',
    totalFats: '',
    totalCarbs: '',
  },
  expectedDishTime: {
    BreakfastTime: '',
    LunchTime: '',
    DinnerTime: '',
  },
  customizeFood: [],
  finalCustomizeFood: [],
  customFoodRenewal: {}, //BN
  stepsIndex: 0,
  customFoodDateCount: '', //BN
  onlyCustomPlan: false,
};

const SummerySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummeryContent: (state, action) => {
      const updates = action.payload;
      // console.log(state.summeryContent, 'summery');
      state.summeryContent = state.summeryContent.map(item => {
        const key = Object.keys(item)[0]; // Get the key of the current item
        return updates.hasOwnProperty(key) ? {[key]: updates[key]} : item;
      });
    },
    setassesMentIds: (state, action) => {
      const updates = action.payload;
      if (state.assesMentIds) {
        state.assesMentIds = state.assesMentIds.map(item => {
          const key = Object.keys(item)[0]; // Get the key of the current item
          return updates.hasOwnProperty(key) ? {[key]: updates[key]} : item;
        });
      }
    },
    setMemberShipData: (state, action) => {
      const updates = action.payload;

      state.memberShipData = Object.keys(state.memberShipData).reduce(
        (updatedData, key) => {
          // If the key exists in the updates, set the new value
          updatedData[key] = updates.hasOwnProperty(key)
            ? updates[key]
            : state.memberShipData[key];
          return updatedData;
        },
        {},
      );
    },
    setEditPlanDetails: (state, action) => {
      const updates = action.payload;

      state.editPlanDetails = Object.keys(state.editPlanDetails).reduce(
        (updatedData, key) => {
          updatedData[key] = updates.hasOwnProperty(key)
            ? updates[key]
            : state.editPlanDetails[key];
          return updatedData;
        },
        {},
      );
    },
    setExpectedDeliveryTime: (state, action) => {
      const updates = action.payload;

      state.expectedDishTime = Object.keys(state.expectedDishTime).reduce(
        (updatedData, key) => {
          updatedData[key] = updates.hasOwnProperty(key)
            ? updates[key]
            : state.expectedDishTime[key];
          return updatedData;
        },
        {},
      );
    },
    setNutrients: (state, action) => {
      const updates = action.payload;
      state.nutrientsList = Object.keys(state.nutrientsList).reduce(
        (updatedData, key) => {
          updatedData[key] = updates.hasOwnProperty(key)
            ? updates[key]
            : state.nutrientsList[key];
          return updatedData;
        },
        {},
      );
    },
    setPlanAmount: (state, action) => {
      state.planAmmount = action.payload;
    },
    setStepsIndex: (state, action) => {
      state.stepsIndex = action.payload;
    },
    setStoreCustomizeFood: (state, action) => {
      state.customizeFood = action.payload;
    },
    setFinalCustomizeFood: (state, action) => {
      state.finalCustomizeFood = action.payload;
    },
    setRenewalCustomFood: (state, action) => {
      state.customFoodRenewal = action.payload;
    },
    setCustomFoodDateCount: (state, action) => {
      state.customFoodDateCount = action.payload;
    },
    setOnlyCustomPlan: (state, action) => {
      state.onlyCustomPlan = action.payload;
    },
    setTriggerEdit: (state, action) => {
      state.triggerEdit = action.payload;
    },
    setPlanDays: (state, action) => {
      state.planDays = action.payload;
    },
  },
});

export const {
  setSummeryContent,
  setStepsIndex,
  setassesMentIds,
  setMemberShipData,
  setPlanAmount,
  setStoreCustomizeFood,
  setFinalCustomizeFood,
  setCustomFoodDateCount, //BN
  setRenewalCustomFood, //BN
  setEditPlanDetails, //BN
  setExpectedDeliveryTime,
  setOnlyCustomPlan,
  setTriggerEdit,
  setNutrients,
  setPlanDays,
} = SummerySlice.actions;

export default SummerySlice.reducer;
