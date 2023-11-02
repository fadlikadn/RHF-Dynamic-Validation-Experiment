import { useForm, useFieldArray, FormProvider } from "react-hook-form";

interface SectionModel {
  airMineral: number;
  buku: number;
  spidol: number;
}

interface ShoppingFormModel {
  sections: SectionModel[];
  // newSections: NewSectionModel[];
}

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = (data: ShoppingFormModel) => {
    // Handle the submitted data, e.g., send it to an API or process it as needed.
    console.log(data);
  };

  const totalItems = watch("sections");

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

  const calculateRemainingAirMineral = () => {
    const totalAirMineral = getTotalQuantity().airMineral;
    return maxQuantities.airMineral - totalAirMineral;
  };

  const hideAirMineralInput = calculateRemainingAirMineral() <= 0;

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
