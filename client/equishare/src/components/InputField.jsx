export default function InputField({id, name, type, value, onChange, placeholder}){
    return(
        <input type={type} id={id} name={name} value={value} onChange={onChange} className="border-2 border-gray-300 rounded-2xl w-full p-2 mt-2" placeholder={placeholder} />
    )
}