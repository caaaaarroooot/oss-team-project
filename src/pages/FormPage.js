import Weather from "../component/Weather";
import QuarantineForm from "../component/QuarantineForm";
import FlightInfo from "../component/FlightInfo";

function FormPage() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px' }}>
            <div style={{ marginRight: '20px' }}>
                <QuarantineForm />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <FlightInfo />
                <Weather />
            </div>
        </div>
    );
}

export default FormPage;