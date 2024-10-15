import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const initialState = {
  createdAt: '',
  updatedAt: '',
  name: '',
  passportId: '',
  birthdate: '',
  nationality: '',
  gender: '',
  departure: '',
  flightCode: '',
  seatNumber: '',
  address: '',
  contact: '',
  visitCountry: [],
  isHealthy: true,
  symptom: [],
  other: [],
  note: '',
  otherDetail: ''
};

const QuarantineForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map(country => ({
          value: country.cca2,
          label: country.name.common
        }));
        setCountryOptions(countries);
      } catch (error) {
        console.error('국가 정보를 가져오는 중 오류 발생:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e, fieldName) => {
    const { name, value, type, checked } = e.target;
    let updatedFormData = { ...formData };

    if (type === 'checkbox') {
      if (fieldName === 'multiSelect') {
        if (checked) {
          updatedFormData[name] = [...updatedFormData[name], value];
        } else {
          updatedFormData[name] = updatedFormData[name].filter(item => item !== value);
        }
      } else {
        updatedFormData[name] = checked;
        if (name === 'isHealthy' && checked) {
          updatedFormData.symptom = [];
          updatedFormData.other = [];
        }
      }
    } else {
      updatedFormData[name] = value;
    }

    if (updatedFormData.symptom.length > 0 || updatedFormData.other.length > 0) {
      updatedFormData.isHealthy = false;
    } else {
      updatedFormData.isHealthy = true;
    }

    setFormData(updatedFormData);
  };

  const handleCountryChange = (selectedOption, fieldName) => {
    let updatedFormData = { ...formData };
    if (fieldName === 'nationality') {
      updatedFormData.nationality = selectedOption ? selectedOption.value : '';
    } else if (fieldName === 'visitCountry') {
      updatedFormData.visitCountry = selectedOption ? selectedOption.map(option => option.value) : [];
    }
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    
    let updatedData = {
      ...formData,
      createdAt: formData.createdAt || currentDate,
      updatedAt: currentDate
    };
  
    if (formData.otherDetail) {
      updatedData.symptom = [...updatedData.symptom, formData.otherDetail];
    }
  
    // post 요청 전에 otherDetail 필드 제거
    delete updatedData.otherDetail;
  
    try {
      const response = await axios.post('https://670c91777e5a228ec1d0b2ca.mockapi.io/api/healthInfo', updatedData);
      console.log('서버 응답:', response.data);
      // setFormData(initialState);
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
    }
  };
  

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>필수정보</legend>
            <table>
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <label>
                      이름:
                      <input type="text" name="name" value={formData.name} onChange={(e) => handleChange(e)} required />
                    </label>
                  </td>
                  <td>
                    <label>
                      성별:</label>
                    <label>
                      <input type="radio" name="gender" value="남" checked={formData.gender === '남'} onChange={(e) => handleChange(e)} /> 남성
                    </label>
                    <label>
                      <input type="radio" name="gender" value="여" checked={formData.gender === '여'} onChange={(e) => handleChange(e)} /> 여성
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>
                      국적:
                      <Select
                        name="nationality"
                        options={countryOptions}
                        value={countryOptions.find(option => option.value === formData.nationality)}
                        onChange={(selectedOption) => handleCountryChange(selectedOption, 'nationality')}
                        placeholder="국적을 선택하세요"
                        isSearchable
                        maxMenuHeight={150}
                      />
                    </label>
                  </td>
                  <td>
                    <label>
                      여권 번호:
                      <input type="text" name="passportId" value={formData.passportId} onChange={(e) => handleChange(e)} required />
                    </label>
                  </td>
                  <td>
                    <label>
                      생년월일:
                      <input type="date" name="birthdate" value={formData.birthdate} onChange={(e) => handleChange(e)} required />
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <label>
                      주소:
                      <input type="text" name="address" value={formData.address} onChange={(e) => handleChange(e)} />
                    </label>
                  </td>
                  <td>
                    <label>
                      연락처:
                      <input type="text" name="contact" value={formData.contact} onChange={(e) => handleChange(e)} />
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>

            <fieldset>
              <legend>여행 정보</legend>
              <label>
                출발국가:
                <input type="text" name="departure" value={formData.departure} onChange={(e) => handleChange(e)} required />
              </label>
              <label>
                항공편명:
                <input type="text" name="flightCode" value={formData.flightCode} onChange={(e) => handleChange(e)} required />
              </label>
              <label>
                좌석번호:
                <input type="text" name="seatNumber" value={formData.seatNumber} onChange={(e) => handleChange(e)} required />
              </label>

              <br />
              <label>
                방문 국가 (최근 21일):
                <Select
                  name="visitCountry"
                  options={countryOptions}
                  isMulti
                  value={countryOptions.filter(option => formData.visitCountry.includes(option.value))}
                  onChange={(selectedOptions) => handleCountryChange(selectedOptions, 'visitCountry')}
                  placeholder="방문한 국가를 선택하세요 (최대 4개)"
                  isSearchable
                  maxMenuHeight={150}
                />
              </label>
            </fieldset>
          </fieldset>

          <br />

          <fieldset>
            <legend>건강 정보</legend>
            <label>
              증상 없음:
              <input type="checkbox" name="isHealthy" checked={formData.isHealthy} onChange={(e) => handleChange(e)} />
            </label>
            <br />

            <div style={{ float: 'left' }}>
              <table>
                <th colSpan={4}>증상</th>
                <tbody>
                  <tr>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="발열" checked={formData.symptom.includes("발열")} onChange={(e) => handleChange(e, 'multiSelect')} /> 발열
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="오한" checked={formData.symptom.includes("오한")} onChange={(e) => handleChange(e, 'multiSelect')} /> 오한
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="두통" checked={formData.symptom.includes("두통")} onChange={(e) => handleChange(e, 'multiSelect')} /> 두통
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="인후통" checked={formData.symptom.includes("인후통")} onChange={(e) => handleChange(e, 'multiSelect')} /> 인후통
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="콧물" checked={formData.symptom.includes("콧물")} onChange={(e) => handleChange(e, 'multiSelect')} /> 콧물
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="기침" checked={formData.symptom.includes("기침")} onChange={(e) => handleChange(e, 'multiSelect')} /> 기침
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="호흡곤란" checked={formData.symptom.includes("호흡곤란")} onChange={(e) => handleChange(e, 'multiSelect')} /> 호흡곤란
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="복통/설사" checked={formData.symptom.includes("복통/설사")} onChange={(e) => handleChange(e, 'multiSelect')} /> 복통/설사
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="구토" checked={formData.symptom.includes("구토")} onChange={(e) => handleChange(e, 'multiSelect')} /> 구토
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="발진" checked={formData.symptom.includes("발진")} onChange={(e) => handleChange(e, 'multiSelect')} /> 발진
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="황달" checked={formData.symptom.includes("황달")} onChange={(e) => handleChange(e, 'multiSelect')} /> 황달
                      </label>
                    </td>
                    <td>
                      <label>
                        <input type="checkbox" name="symptom" value="의식 저하" checked={formData.symptom.includes("의식 저하")} onChange={(e) => handleChange(e, 'multiSelect')} /> 의식 저하
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="1">
                      <label>
                        <input type="checkbox" name="symptom" value="점막 지속 출혈" checked={formData.symptom.includes("점막 지속 출혈")} onChange={(e) => handleChange(e, 'multiSelect')} /> 점막 지속 출혈
                      </label>
                    </td>
                    <td colSpan="3">
                      <label>
                        <input type="checkbox" name="symptom" value="기타" checked={formData.symptom.includes("기타")} onChange={(e) => handleChange(e, 'multiSelect')} /> 기타
                      </label>
                      <textarea name="otherDetail" value={formData.otherDetail || ''} onChange={(e) => handleChange(e)}></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />

            <div style={{ float: 'right' }}>
              <table>
                <th colSpan={4}>의심 활동</th>
                <tbody>
                  <tr>
                    <td>
                      <label>
                        <input type="checkbox" name="other" value="증상 관련 약 복용" checked={formData.other.includes("증상 관련 약 복용")} onChange={(e) => handleChange(e, 'multiSelect')} /> 증상 관련 약 복용
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>
                        <input type="checkbox" name="other" value="현지 병원 방문" checked={formData.other.includes("현지 병원 방문")} onChange={(e) => handleChange(e, 'multiSelect')} /> 현지 병원 방문
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>
                        <input type="checkbox" name="other" value="동물접촉" checked={formData.other.includes("동물접촉")} onChange={(e) => handleChange(e, 'multiSelect')} /> 동물 접촉 여부
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <label>
              비고:
              <textarea name="note" value={formData.note} onChange={(e) => handleChange(e)}></textarea>
            </label>
          </fieldset>
          <button type="submit">제출</button>
        </form>
      </div>
      
    </div>

  );
};

export default QuarantineForm;