import { useForm, useFieldArray, FormProvider } from "react-hook-form";

interface SectionModel {
  airMineral: number;
  buku: number;
  spidol: number;
}

interface ItemModel {
  itemName: string;
  itemId: string;
  amount: number;
}

interface NewSectionModel {
  items: ItemModel[];
}

interface ShoppingFormModel {
  sections: SectionModel[];
  // newSections: NewSectionModel[];
}

interface ShoppingFormModel2 {
  sections: NewSectionModel[];
}

const availableItems: ItemModel[] = [
  { itemName: "Air Mineral", itemId: "airMineral", amount: 0 },
  { itemName: "Buku", itemId: "buku", amount: 0 },
  { itemName: "Spidol", itemId: "spidol", amount: 0 },
];

// Validation rules for maximum quantities
const maxQuantities: Record<string, number> = {
  airMineral: 10,
  buku: 5,
  spidol: 7,
};

export default function App() {
  const useForm1 = useForm<ShoppingFormModel>({
    defaultValues: {
      sections: [],
    },
  });
  const { control, handleSubmit, watch, register, setValue, getValues } =
    useForm1;
  const useForm2 = useForm<ShoppingFormModel2>({
    defaultValues: {
      sections: [
        {
          items: availableItems.map((item) => {
            return {
              itemId: item.itemId,
              itemName: item.itemName,
              amount: maxQuantities[item.itemId],
            };
          }),
        },
      ],
      // sections: [],
    },
  });
  const {
    control: control2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    register: register2,
    setValue: setValue2,
    getValues: getValues2,
  } = useForm2;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const {
    fields: fields2,
    append: append2,
    remove: remove2,
  } = useFieldArray({
    control: control2,
    name: "sections",
  });

  const onSubmit = (data: ShoppingFormModel) => {
    // Handle the submitted data, e.g., send it to an API or process it as needed.
    console.log(data);
  };

  const onSubmit2 = (data: ShoppingFormModel2) => {
    console.log(data);
  };

  const totalItems = watch("sections");
  const totalNewItems = watch2("sections");

  const getTotalQuantity2 = () => {
    const totalQuantity: Record<string, number> = {};

    for (const section of totalNewItems) {
      for (const item of section.items) {
        if (totalQuantity[item.itemId]) {
          totalQuantity[item.itemId] += Number(item.amount);
        } else {
          totalQuantity[item.itemId] = Number(item.amount);
        }
      }
    }

    return totalQuantity;
  };

  const getTotalQuantity = () => {
    let totalAirMineral = 0;
    let totalBuku = 0;
    let totalSpidol = 0;

    for (const section of totalItems) {
      totalAirMineral += Number(section.airMineral);
      totalBuku += Number(section.buku);
      totalSpidol += Number(section.spidol);
    }

    return {
      airMineral: totalAirMineral,
      buku: totalBuku,
      spidol: totalSpidol,
    };
  };

  const calculateSectionTotal = (section: SectionModel) => {
    const { airMineral, buku, spidol } = section;
    return airMineral + buku + spidol;
  };

  const calculateSectionTotal2 = (
    section: ItemModel[],
  ): Array<{ itemId: string; amount: number }> => {
    return section.map((item) => {
      return {
        itemId: item.itemId,
        amount: item?.amount || 0,
      };
    });
  };

  const calculateRemainingItem = (itemId: string) => {
    const totalItemId = getTotalQuantity2()[itemId];
    console.log(totalItemId, getTotalQuantity2());
    return maxQuantities[itemId] - totalItemId;
  };

  const calculateRemainingAirMineral = () => {
    const totalAirMineral = getTotalQuantity().airMineral;
    return maxQuantities.airMineral - totalAirMineral;
  };

  const hideItemIdInput = (itemId: string) => {
    return calculateRemainingItem(itemId) <= 0;
  };
  const hideAirMineralInput = calculateRemainingAirMineral() <= 0;

  const addSection2 = () => {
    const sectionValue: NewSectionModel = {
      items: [],
    };
    for (const item of availableItems) {
      let itemValue = calculateRemainingItem(item.itemId);
      if (hideItemIdInput(item.itemId)) {
        itemValue = 0;
      }
      console.log("amount", itemValue);
      sectionValue.items.push({
        itemId: item.itemId,
        itemName: item.itemName,
        amount: itemValue,
      });
    }

    append2(sectionValue);
  };

  const addSection = () => {
    let airMineralInitialValue = calculateRemainingAirMineral();
    if (hideAirMineralInput) {
      airMineralInitialValue = 0;
    }
    append({
      airMineral: airMineralInitialValue,
      buku: 0,
      spidol: 0,
    });
  };

  return (
    <>
      <FormProvider {...useForm2}>
        <form onSubmit={handleSubmit2(onSubmit2)}>
          <h2>Shopping Allocation Dynamic</h2>
          {fields2.map((section, index) => (
            <div key={section.id}>
              <h3>Section {index + 1}</h3>
              {section.items.map((item, i) => (
                <>
                  <label htmlFor={`sections.${index}.items.${i}`}>
                    {item.itemName}
                  </label>
                  {hideItemIdInput(item.itemId) &&
                  Number(getValues2(`sections.${index}.items.${i}.amount`)) ===
                    0 ? (
                    <div>Hidden</div>
                  ) : (
                    <input
                      type="number"
                      {...register2(`sections.${index}.items.${i}.amount`, {
                        validate: (value) =>
                          value <= maxQuantities[item.itemId] ||
                          "Exceeds maximum quantity!",
                      })}
                    />
                  )}
                </>
              ))}
              <div>Total Quantity: </div>
              {fields2.length > 1 && (
                <button type="button" onClick={() => remove2(index)}>
                  Remove Section
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSection2}>
            Add Section 2
          </button>
          <div>Total Sections: {totalNewItems.length}</div>
          <div>
            Total Combined Quantity:
            {JSON.stringify(getTotalQuantity2())}
          </div>
        </form>
      </FormProvider>

      <FormProvider {...useForm1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Shopping Allocation</h2>
          {fields.map((section, index) => (
            <div key={section.id}>
              <h3>Section {index + 1}</h3>
              <label htmlFor={`sections.${index}.airMineral`}>
                Air Mineral:
              </label>
              {hideAirMineralInput &&
              Number(getValues(`sections.${index}.airMineral`)) === 0 ? (
                <div>Hidden</div>
              ) : (
                <input
                  type="number"
                  // disabled={!isInputEnabled("airMineral", section)}
                  {...register(`sections.${index}.airMineral`, {
                    validate: (value) =>
                      value <= maxQuantities.airMineral ||
                      "Exceeds maximum quantity!",
                  })}
                  // onChange={(e) => updateAirMineral(index, Number(e.target.value))}
                />
              )}

              <label htmlFor={`sections[${index}].buku`}>Buku:</label>
              <input
                type="number"
                {...register(`sections.${index}.buku`, {
                  validate: (value) =>
                    value <= maxQuantities.buku || "Exceeds maximum quantity!",
                })}
                // disabled={!isInputEnabled("buku", section)}
              />
              <label htmlFor={`sections[${index}].spidol`}>Spidol:</label>
              <input
                type="number"
                {...register(`sections.${index}.spidol`, {
                  validate: (value) =>
                    value <= maxQuantities.spidol ||
                    "Exceeds maximum quantity!",
                })}
                // disabled={!isInputEnabled("spidol", section)}
              />
              <div>Total Quantity: {calculateSectionTotal(section)}</div>
              <button type="button" onClick={() => remove(index)}>
                Remove Section
              </button>
            </div>
          ))}
          <button type="button" onClick={addSection}>
            Add Section
          </button>
          <div>Total Sections: {totalItems.length}</div>
          <div>
            Total Combined Quantity:
            {JSON.stringify(getTotalQuantity())}
          </div>
          {getTotalQuantity().airMineral > maxQuantities.airMineral ||
          getTotalQuantity().buku > maxQuantities.buku ||
          getTotalQuantity().spidol > maxQuantities.spidol ? (
            <div>Total combined quantity exceeds maximum limits!</div>
          ) : null}
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    </>
  );
}
