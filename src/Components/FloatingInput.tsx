function FloatingInput(props: any) {
    const { label, type, placeholder, disabled, onChange, myValue, required } = props
    return (
        <>
            <div className="form-floating mb-3">
                <input type={type} disabled={disabled ? true : false} required={required ? true : false} value={myValue} className="form-control bg-bodyGray" id="floatingInput" placeholder={placeholder} onChange={onChange} />
                <label htmlFor="floatingInput" className='text-muted'>{label}</label>
            </div>
        </>
    )
}

export default FloatingInput
