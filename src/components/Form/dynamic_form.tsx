import React, {useState, useEffect, useRef} from 'react';
import { Formik, Form, Field, FieldProps, FormikHelpers, FormikErrors, FormikTouched} from 'formik';
import * as Yup from 'yup';
import { useAtom } from "jotai";
import {inputsType, inputFormType, formType, formValuesType, choiceCardType, dateRangeTimeType, priceType, currencyType, addressType, imagesType} from '@/type/formType';
import {dateRangeTimeErrorType, choiceCardsErrorType, priceErrorType, addressErrorType, imagesErrorType} from '@/type/formErrorType';
import HorizontalNavigableProgressBar from "@/components/Progress/horizontal_navigable_progress_bar";
import RedRoundedButton from "@/components/Buttons/rounded_button";
import { useTranslations } from "next-intl";
import BooleanChoice from "@/components/Creation_activity_widgets/boolean_choice";
import SelectionNumber from "@/components/Creation_activity_widgets/selection_number";
import InputText from "@/components/Creation_activity_widgets/input_text";
import MultipleChoiceCard from "@/components/Creation_activity_widgets/multiple_choice_cards";
import MultipleChoiceModal from "@/components/Creation_activity_widgets/multiple_choice_modal";
import MultipleChoiceSelect from "@/components/Creation_activity_widgets/multiple_choice_select";
import SelectionDate from "@/components/Creation_activity_widgets/selection_date";
import InputAddress from "@/components/Creation_activity_widgets/input_address";
import ImageUploadAndCrop from "@/components/Creation_activity_widgets/selection_photo";
import SelectionPrice from "@/components/Creation_activity_widgets/selection_price";
import AddableChoices from "@/components/Creation_activity_widgets/addable_choices";
import SelectionGroup from "@/components/Creation_activity_widgets/selection_group";
import Info from "@/components/Creation_activity_widgets/info";
import NewActivityRecapPagefrom from "@/components/Form/new_activity_recap_page";
import { createEventCurrentStepFormAtom, createEventsubmittedFormValuesAtom} from "@/atoms/atoms_events";
import { isEqual } from "@/utils/isEqual";
import { convertFormToEventType, convertFormToEventTypeNotComplete } from "@/utils/convertEventType";
import { saveEvent } from "@/services/eventService";
import { useRouter } from "next/navigation";
import LoadingDots from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import ErrorBoundaryCard from "@/components/Errors/error_boundary_card";

  type FormProps = {
    formData: formType;
    eventId: string;
  };
  
  const DynamicForm: React.FC<FormProps> = ({ formData, eventId }) => {
    const t = useTranslations("Form");
    const t_error = useTranslations("ErrorBoundaryCard");
    const router = useRouter();
    const submitFormRef = useRef<() => void>(() => {});
    const [currentStep, setCurrentStep] = useAtom(createEventCurrentStepFormAtom);
    const [submittedFormValues, setSubmittedFormValues] = useAtom(createEventsubmittedFormValuesAtom);
    const [formPageValues, setFormPageValues] = useState<formValuesType>({}); // Keep track of the current page data
    const [showCheckPoint, setShowCheckPoint] = useState(window.innerWidth > 640);
    const [publishing, setPublishing] = useState(false); // Avoid multiple publishing of the same event
    const { user } = useAuth();
    
    const updateScreenSize = () => {
      setShowCheckPoint(window.innerWidth > 640);
    };
  
    useEffect(() => {
      updateScreenSize();
      window.addEventListener('resize', updateScreenSize);
      return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (currentStep !== formData.length && event.key === 'Enter' && event.shiftKey && currentStep !== formData.length) {
          submitFormRef.current();
        }
      };
    
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentStep, formData.length]); // Re-run the effect only if currentStep or formData.length changes
    

    const generateInitialValues = (inputs: inputFormType[], submittedFormValues: formValuesType): formValuesType => {
        const initialValues: formValuesType = {};
        inputs.forEach(input => {
          if (input.type === inputsType.Info) return;
          if (submittedFormValues[input.id] !== undefined) { // Use the existing value from allFormValues if present
            initialValues[input.id] = submittedFormValues[input.id];
          } else { // Otherwise, fallback to the default value based on the input type
            switch (input.type) {
                case inputsType.Boolean:
                    initialValues[input.id] = input.initialTrue ?? false;
                    break;
                case inputsType.Number:
                    initialValues[input.id] = input.initialValue || 0;
                    break;
                case inputsType.Text:
                    initialValues[input.id] = input.initialValue || "";
                    break;
                case inputsType.MultipleChoiceCard:
                    initialValues[input.id] = input.initialChoices || [];
                    break;
                case inputsType.Groups:
                    initialValues[input.id] = [];
                    break;
                case inputsType.MultipleChoiceSelect:
                    initialValues[input.id] = input.initialKey || [];
                    break;
                case inputsType.MultipleChoiceModal:
                    initialValues[input.id] = input.initialKey || [];
                    break;
                case inputsType.AddableChoices:
                    initialValues[input.id] = input.initialAddableChoices || [];
                    break;
                case inputsType.Date:
                    initialValues[input.id] = input.initialDateRangeTime || {dateRange: {startDate:  "", endDate: ""}, startTime: "", endTime: ""} as dateRangeTimeType;
                    break;
                case inputsType.Price:
                    initialValues[input.id] = {price: input.initialValue !== undefined ? String(input.initialValue) : "", currency: input.initialCurrency !== undefined ? input.initialCurrency : input.currencyChoices?.length !== 0 ? undefined : undefined} as priceType;
                    break;
                case inputsType.Address:
                  initialValues[input.id] = input.initialAddress as addressType || {country: "", city: "", postal_code: "", route: "", street_number: ""};
                  break;
                case inputsType.Photos:
                  initialValues[input.id] = {cover: input.initialCover !== undefined ? String(input.initialCover) : "", photos: input.initialPhotos !== undefined ? String(input.initialPhotos) : []} as imagesType; //  ||
                  break;
                default:
                    // initialValues[input.id] = null;
                    break;
            }
          }
        });
        return initialValues;
    };
      
    const generateValidationSchema = (inputs: inputFormType[]) => {
        const shape: { [key: string]: any } = {};
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // Regex to validate "hh:mm" format
        inputs.forEach(input => {
          // Skip non-visible inputs so that if some visibility is false we don't check if the value is good since we will use the initialValue
          if (input.type === inputsType.Info || !shouldBeVisible(input, {...submittedFormValues, ...formPageValues})) return;
          let baseSchema;
          switch (input.type) {
            case inputsType.Boolean:
              baseSchema = Yup.boolean();
              break;
            case inputsType.Number:
              baseSchema = Yup.number()
              .typeError(t('error_message_bad_number_type'))
              .min(input.minValue ?? 0, t('error_message_number_min') + (input.minValue ?? 0))
              .max(input.maxValue ?? Number.MAX_VALUE, t('error_message_number_max') + (input.maxValue ?? Number.MAX_VALUE));
            break;
            case inputsType.Text:
              baseSchema = Yup.string().max(input.maxLength ?? 10000, t('error_message_text_max') + (input.maxLength ?? 10000));
              break;
            case inputsType.MultipleChoiceCard:
              baseSchema = Yup.array()
                .of(Yup.string())
                .min(input.minNbrChoice ?? 0, t('error_message_multiple_choice_card_min') + (input.minNbrChoice ?? 0))
                .max(input.maxNbrChoice ?? Number.MAX_VALUE, t('error_message_multiple_choice_card_max') + (input.maxNbrChoice ?? Number.MAX_VALUE))
              break;
            case inputsType.Groups:
              baseSchema = Yup.array()
                .of(Yup.string())
                .min(input.minNbrChoice ?? 0, t('error_message_groups_min') + (input.minNbrChoice ?? 0))
                .max(input.maxNbrChoice ?? Number.MAX_VALUE, t('error_message_groups_max') + (input.maxNbrChoice ?? Number.MAX_VALUE))
              break;
            case inputsType.MultipleChoiceSelect:
              baseSchema = Yup.array()
                .of(Yup.string())
                .min(input.minNbrChoice ?? 1, t('error_message_multiple_choice_selection_min') + (input.minNbrChoice ?? 0))
                .max(input.maxNbrChoice ?? Number.MAX_VALUE, t('error_message_multiple_choice_selection_max') + (input.maxNbrChoice ?? Number.MAX_VALUE))
              break;
            case inputsType.MultipleChoiceModal:
              baseSchema = Yup.array()
                .of(Yup.string())
                .min(input.minNbrChoice ?? 1, t('error_message_multiple_choice_modal_min') + (input.minNbrChoice ?? 0))
                .max(input.maxNbrChoice ?? Number.MAX_VALUE, t('error_message_multiple_choice_modal_max') + (input.maxNbrChoice ?? Number.MAX_VALUE))
              break;
            case inputsType.AddableChoices:
              baseSchema = Yup.array().of(
                Yup.object().shape({
                  id: Yup.number().required(t('error_message_id_required')),
                  name: Yup.string().required(t('error_message_name_required')),
                  number: Yup.number()
                    .min(input.minValue ?? 0, t('error_message_number_min') + (input.minValue ?? 0))
                    .max(input.maxValue ?? Number.MAX_VALUE, t('error_message_number_max') + (input.maxValue ?? Number.MAX_VALUE))
                    .required(t('error_message_number_required')),
                })
              ).min(input.minNbrChoice ?? 0, t('error_message_addable_choice_min') + (input.minNbrChoice ?? 0))
                .max(input.maxNbrChoice ?? Number.MAX_VALUE, t('error_message_addable_choice_max') + (input.maxNbrChoice ?? Number.MAX_VALUE))
                .required(t('error_message_array_required'));
              break
            case inputsType.Date:
              baseSchema = Yup.object().shape({
                dateRange: Yup.object().shape({
                  startDate: Yup.date()
                    .required(t('error_message_required'))
                    .typeError(t('error_message_start_date_invalid')),
                  endDate: Yup.date()
                    .required(t('error_message_required'))
                    .typeError(t('error_message_end_date_invalid'))
                }),
                startTime: Yup.string()
                  .required(t('error_message_required'))
                  .matches(timeRegex, t('error_message_time_format')),
                endTime: Yup.string()
                  .required(t('error_message_required'))
                  .matches(timeRegex, t('error_message_time_format')),
              });
              break;
            case inputsType.Price:
              let currencySchema;
              if (input.currencyChoices && input.currencyChoices.length > 0) {
                currencySchema = Yup.object().shape({
                  key: Yup.string().required(t('error_message_currency_required')),
                  title: Yup.string().required(t('error_message_currency_required')),
                  symbole: Yup.string(),
                }).required(t('error_message_currency_required'));
              } else {
                currencySchema = Yup.object().shape({
                  key: Yup.string(),
                  title: Yup.string(),
                  symbole: Yup.string(),
                });
              }
              baseSchema = Yup.object().shape({
                price: Yup.string().required(t('error_message_price_required')),
                currency: currencySchema,
              });
              break;
            case inputsType.Address:
              baseSchema = Yup.object().shape({
                country: Yup.string().required(t('error_message_country_required')),
                city: Yup.string().required(t('error_message_city_required')),
                postal_code: Yup.string().required(t('error_message_postal_code_required')),
                route: Yup.string().required(t('error_message_route_required')),
                street_number: Yup.string().required(t('error_message_street_number_required')),
              });
              break;
            case inputsType.Photos:
              baseSchema = Yup.object().shape({
                cover: Yup.string().required(t('error_message_cover_required')),
                photos: Yup.array().of(Yup.string().required(t('error_message_photo_empty'))).required(t('error_message_photos_required'))
              });
              break;
            default:
              baseSchema = Yup.object();
              break;
          }
          // Fields are required by default, unless explicitly set to false
          if (input.required !== false) {baseSchema = baseSchema.required(t('error_message_required'));}
          if (baseSchema) {shape[input.id] = baseSchema;}
        });
        return Yup.object().shape(shape);
    };
      
    const renderComponent = (input: inputFormType, field: FieldProps<any, formValuesType>['field'], form: FieldProps<any, formValuesType>['form']) => {
      const errorsMessages = getErrorsMessages(input.id, form.errors, form.touched);

      const commonProps = {
        title: input.title,
        description: input.description,
        disableChange: false,
      };

      const handleChange = (input_id: string, value: any) => {
        setFormPageValues({ ...form.values, [input_id]: value });
      };

      const isVisible = shouldBeVisible(input, {...submittedFormValues, ...form.values});
      if (!isVisible) {return null; } // Do not render the component if it doesn't meet visibility conditions
      if (field.value === undefined) return null; // Avoid the fact that field.value is something first undefined and after a split of second take the initial value. //TODO
      switch (input.type) {
        case inputsType.Boolean:
          return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <BooleanChoice
                {...commonProps}
                value={field.value as boolean}
                setValue={(value: boolean) => {
                  form.setFieldValue(input.id, value);
                  handleChange(input.id, value);
                }}
                errors={errorsMessages}
              />
              </ErrorBoundaryCard>
          );
        case inputsType.Number:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <SelectionNumber
                  {...commonProps}
                  errors={errorsMessages}
                  value={field.value as number}
                  setValue={(value: number) => {
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                  minValue={input.minValue}
                  maxValue={input.maxValue}
                />
                </ErrorBoundaryCard>
            );
        case inputsType.Text:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <InputText
                  {...commonProps}
                  errors={errorsMessages}
                  placeholder={input.placeholder}
                  value={field.value as string}
                  setValue={(value: string) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                  maxLength={input.maxLength}
                  minRow={input.minRow}
                  maxRow={input.maxRow}
                />
                </ErrorBoundaryCard>
            );
        case inputsType.MultipleChoiceCard:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <MultipleChoiceCard
                  {...commonProps}
                  errors={errorsMessages}
                  choices={input.choices}
                  selected={field.value as string[]}
                  setSelected={(value: string[]) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                  multipleSelection={input.multipleSelection}
                  minWidth={input.minWidth}
                  minHeight={input.minHeight}
                />
                </ErrorBoundaryCard>
            );
        case inputsType.MultipleChoiceSelect:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <MultipleChoiceSelect
                  {...commonProps}
                  errors={errorsMessages}
                  labelChoices={input.labeledChoices}
                  selected={field.value as string[]}
                  setSelected={(value: string[]) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                />
                </ErrorBoundaryCard>
            );
        case inputsType.Groups:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <SelectionGroup
                  {...commonProps}
                  errors={errorsMessages}
                  selected={field.value as string[]}
                  setSelected={(value: string[]) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                  multipleSelection={input.multipleSelection}
                  minSize={input.minWidth}
                />
                </ErrorBoundaryCard>
            );
        case inputsType.MultipleChoiceModal:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <MultipleChoiceModal
                  {...commonProps}
                  errors={errorsMessages}
                  selected={field.value as string[]}
                  setSelected={(value: string[]) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                  multipleSelection={input.multipleSelection}
                  choices={input.choices}
                  useKeyInSearch={input.useKeyAsCode}
                  dictionnaryKey={input.dictionnaryKey}
                  isPhone={!showCheckPoint}
                />
                </ErrorBoundaryCard>
            );
        case inputsType.AddableChoices:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <AddableChoices
                  {...commonProps}
                  titleAdd={input.titleAddAddableChoices}
                  titleName={input.titleNameAddableChoices}
                  titleDescription={input.titleDescriptionAddableChoices}
                  titleNumber={input.titleNumberAddableChoices}
                  errors={errorsMessages as choiceCardsErrorType}
                  choices={field.value as choiceCardType[]}
                  setChoices={(value: choiceCardType[]) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                  initialName={input.initialName}
                  initialValue={input.initialValue}
                  minValue={input.minValue}
                  maxValue={input.maxValue}
                  maxLengthName={input.maxLengthName}
                  maxLengthDescription={input.maxLengthDescription}
                  maxNbrChoice={input.maxNbrChoice}
                />
              </ErrorBoundaryCard>
            );
        case inputsType.Date:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <SelectionDate
                  disableChange={false}
                  errors={errorsMessages as dateRangeTimeErrorType}
                  datesRangeTime={field.value as dateRangeTimeType}
                  setDatesRangeTime={(value: dateRangeTimeType) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                />
              </ErrorBoundaryCard>
            );
        case inputsType.Price:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <SelectionPrice
                  {...commonProps}
                  errors={errorsMessages as priceErrorType}
                  price={field.value as priceType}
                  setPrice={(value: priceType) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                  currencies={input.currencyChoices !== undefined ? input.currencyChoices : [{key: "EUR", title: "euro", symbole: "€"} as currencyType]}
                  minValue={input.minValue}
                  maxValue={input.maxValue}
                />
              </ErrorBoundaryCard>
            );
        case inputsType.Address:
            return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <InputAddress
                  disableChange={false}
                  errors={errorsMessages as addressErrorType}
                  address={field.value as addressType}
                  setAddress={(value: addressType) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                />
              </ErrorBoundaryCard>
            );
        case inputsType.Photos:
          return (
              <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
                <ImageUploadAndCrop
                  disableChange={false}
                  errors={errorsMessages as imagesErrorType}
                  images={field.value as imagesType}
                  setImages={(value: imagesType) => { 
                    form.setFieldValue(input.id, value);
                    handleChange(input.id, value);
                  }}
                />
              </ErrorBoundaryCard>
          );
        default:
          return null;
      }
    };

    // Retreive the errors message on each component so that I can show each error message
    const getErrorsMessages = (name: string, errors: FormikErrors<formValuesType>, touched: FormikTouched<formValuesType>): string | undefined => {
      return errors[name] && touched[name] ? errors[name] : undefined;
    };

    const shouldBeVisible = (input: inputFormType, values: formValuesType): boolean => {
      if (!input.visibility || Object.keys(input.visibility).length === 0) {
        return true;
      }

      return Object.entries(input.visibility).every(([key, value]) => {
        return isEqual(values[key], value); // Since the type can be Boolean, string, string[], I need a function that will compare both value and not only use "==="
      });
    }

    const saveCurrentPage = async (): Promise<formValuesType> => {
      if(currentStep == formData.length){
        return submittedFormValues;
      }

      const validFormValues: formValuesType = {};
      const initialValuesForCurrentStep = generateInitialValues(formData[currentStep].inputs, {});
      const currentValidationSchema = generateValidationSchema(formData[currentStep].inputs);
    
      // Determine in the formPageValues which values are valid
      for (const [key, value] of Object.entries(formPageValues)) {
        try {
          const tempValues: formValuesType = { ...submittedFormValues, [key]: value };
          await currentValidationSchema.validateAt(key, tempValues);
          validFormValues[key] = value;
        } catch (error) {} // If error just skip the value
      }

      // On the valid fields, resetting non-visible fields to their initial values
      Object.keys(validFormValues).forEach(key => {
        const inputConfig = formData[currentStep].inputs.find(input => input.id === key);
        if (inputConfig && inputConfig.type !== inputsType.Info && !shouldBeVisible(inputConfig, { ...submittedFormValues, ...formPageValues })) {
          validFormValues[key] = initialValuesForCurrentStep[key];
        }
      });
    
      const newFormValues = {
        ...submittedFormValues,
        ...validFormValues,
      };

      // Save each valid field from the current page in the submittedFormValues
      setSubmittedFormValues(newFormValues);

      // Return the new, updated form values
      return newFormValues;
    };

    const handleSubmit = (values: formValuesType, actions: FormikHelpers<formValuesType>) => {
      const initialValuesForCurrentStep = generateInitialValues(formData[currentStep].inputs, {}); // Get the initial values from the current form page
      const updatedFormValues = { ...initialValuesForCurrentStep, ...submittedFormValues}; // Overwrite by the submittedFormValues then reoverwrite by the current page values. Like that if a component is never visible, his initial value will still be in the database to avoid any errors
      
      for (const input of formData[currentStep].inputs) {
        if(input.type !== inputsType.Info){
          const isVisible = shouldBeVisible(input, { ...submittedFormValues, ...values }); // Merge current page values with previously submitted values for a full picture
          if (isVisible) {
            updatedFormValues[input.id] = values[input.id]; // Use the value from the current submission
          } else {
            updatedFormValues[input.id] = initialValuesForCurrentStep[input.id]; // Reset to initial if not visible
          }
        }
      }

      setSubmittedFormValues(updatedFormValues);
      // Handle step progression
      if (currentStep < formData.length) {
          setCurrentStep(currentStep + 1);
      }
      actions.setSubmitting(false);
    };

    const handleSaveAndExit = async () => {
      setPublishing(true);
      try {
        const updatedValues = await saveCurrentPage()
        if (Object.keys(updatedValues).length === 0) {
            router.push("/myActivities");
        } else {
            const eventTypeResult = await convertFormToEventTypeNotComplete(updatedValues, true, user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid, eventId);
            await saveEvent(eventTypeResult, eventId);
            router.push("/myActivities");
            setCurrentStep(0);
            setSubmittedFormValues({});
        }
      } catch (error) {
        setPublishing(false);
        console.error("Error saving event type:", error);
      }
    };

    const handleFinalSubmission = async () => {
      setPublishing(true);
      try {
        const eventTypeResult = await convertFormToEventType(submittedFormValues, false, user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid, eventId);
        await saveEvent(eventTypeResult, eventId);

        // GO BACK ACTIVITY
        router.push("/myActivities");
        setCurrentStep(0);
        setSubmittedFormValues({});
      } catch (error) {
        setPublishing(false);
        console.error("Error converting event type:", error);
      }
    };

    if (publishing){
      return (
        <div className="h-full w-full flex justify-center items-center">
          <LoadingDots size={50} />
        </div>
      )
    }

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-end p-5">
          <RedRoundedButton
            text={t("save_and_exit")}
            sizeText={18}
            onClick={() => {
                if (!publishing){
                  (async () => {
                    try {
                      await handleSaveAndExit();
                    } catch (error) {
                      console.error("Failed to save event:", error);
                    }
                  })();
                }
            }}
            size="md"
            responsiveness={20}
          />
        </div>
        { currentStep === formData.length ? 
        <div className="w-full h-full px-[5%] lg:px-[15%] self-center flex flex-col items-start overflow-y-auto">
          <NewActivityRecapPagefrom />
        </div> :
        <div className="w-full h-full px-[5%] lg:px-[15%] self-center flex flex-col items-start overflow-y-auto">
          {formData[currentStep].pageTitle && (
            <div className="text-xl lg:text-2xl xl:text-3xl font-bold pb-1 sm:pb-4 shrink-0">
              {formData[currentStep].pageTitle}
            </div>
          )}
          {formData[currentStep].pageDescription && (
            <div className="text-base lg:text-xl xl:text-2xl font-light pb-1 sm:pb-4 shrink-0 text-justify">
              {formData[currentStep].pageDescription}
            </div>
          )}
          <div className="h-full w-full">
          <Formik
            initialValues={generateInitialValues(formData[currentStep].inputs, submittedFormValues)}
            validationSchema={generateValidationSchema(formData[currentStep].inputs)}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ submitForm }) => {
              submitFormRef.current = submitForm; // Update ref each render

              return (
                <Form>
                    {formData[currentStep].inputs.map(input => {
                      if (input.type === inputsType.Info) { return <Info key={input.id} title={input.title} description={input.description} />;} 
                      else {
                        return (
                          <Field name={input.id} key={input.id}>
                              {({ field, form }: FieldProps<any, formValuesType>) => renderComponent(input, field, form)}
                          </Field>
                          );
                      }
                    })}
                </Form>
              );
            }}
          </Formik>
          </div>
        </div>
        }
        <div className="w-full">
          <HorizontalNavigableProgressBar
            currentIndex={currentStep}
            maxValue={formData.length + 1}
            setIndex={setCurrentStep}
            onNext={() => {
              if (currentStep !== formData.length) {
                submitFormRef.current();
              } else {
                if (!publishing){
                  (async () => {
                    try {
                      await handleFinalSubmission();
                    } catch (error) {
                      console.error("Failed to create event:", error);
                    }
                  })();
                }
              }
            }}
            onPrevious={async () => {
              if (currentStep !== formData.length) {
                await saveCurrentPage();
              }
            }}
            leftToolTipMessage={t("previous")}
            rightToolTipMessage={t("next")}
            finalMessage={t("publish")}
            showCheckPoint={showCheckPoint}
            clickableCheckPoint={false}
          />
        </div>
      </div>
      );
    };
export default DynamicForm;