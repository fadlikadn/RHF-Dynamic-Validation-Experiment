import { useForm, useFieldArray, FormProvider } from "react-hook-form";

interface ItemModel {
  itemName: string;
  itemId: string;
  amount: number;
}

interface NewSectionModel {
  items: ItemModel[];
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

const Dynamic = () => {
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

  const {
    fields: fields2,
    append: append2,
    remove: remove2,
  } = useFieldArray({
    control: control2,
    name: "sections",
  });

  const onSubmit2 = (data: ShoppingFormModel2) => {
    console.log(data);
  };

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

  const hideItemIdInput = (itemId: string) => {
    return calculateRemainingItem(itemId) <= 0;
  };

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
    </>
  )
}

export default Dynamic
