import { Formik } from "formik";
function FormWrapper({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  className,
  ...otherProps
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => (
        <div
          role="form"
          className={"px-10 pt-5 pb-10 card " + className}
          {...otherProps}
        >
          {children}
        </div>
      )}
    </Formik>
  );
}

export default FormWrapper;
