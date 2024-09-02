function MyTextarea(props: any) {
  const { label, onChange, value, required } = props;
  return (
    <>
      <div className="form-floating">
        <textarea
          required={required ? true : false}
          className="form-control bg-white"
          onChange={onChange}
          placeholder="Leave a comment here"
          id="floatingTextarea2"
          value={value}
          style={{ height: "100px" }}
        ></textarea>
        <label htmlFor="floatingTextarea2">{label}</label>
      </div>
    </>
  );
}

export default MyTextarea;
