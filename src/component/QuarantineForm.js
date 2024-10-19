import React, { useState, useEffect, forwardRef } from 'react';
import Select from 'react-select';
import axios from 'axios';
import styles from './QuarantineForm.module.css';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import 'sweetalert2/dist/sweetalert2.min.css';

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

const schema = yup.object().shape({
  name: yup.string().required('이름은 필수 입력 항목입니다.'),
  passportId: yup
    .string()
    .matches(/^[A-Za-z0-9]*$/, '여권번호는 영어와 숫자만 입력 가능합니다.')
    .required('여권번호는 필수 입력 항목입니다.'),
  birthdate: yup.string().required('생년월일은 필수 입력 항목입니다.'),
  nationality: yup.string().required('국적은 필수 입력 항목입니다.'),
  flightCode: yup
    .string()
    .matches(/^[A-Za-z].*/, '항공편명은 알파벳으로 시작해야 합니다.')
    .required('항공편명은 필수 입력 항목입니다.'),
  seatNumber: yup.string().required('좌석번호는 필수 입력 항목입니다.'),
  gender: yup.string().required('성별은 필수 선택 항목입니다.'),
  departure: yup.string().required('출발일은 필수 입력 항목입니다.'),
  address: yup.string().required('주소는 필수 입력 항목입니다.'),
  contact: yup
    .string()
    .matches(/^\d+$/, '연락처는 숫자만 입력 가능합니다.')
    .required('연락처는 필수 입력 항목입니다.'),
});

const QuarantineForm = forwardRef(({ mode = 'new', existingData = initialState, onDelete, onSave }, ref) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const navigate = useNavigate();

  const { control, formState: { errors }, handleSubmit, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: existingData,
  });

  const watchedSymptom = watch("symptom", []);
  const watchedOther = watch("other", []);
  const watchedIsHealthy = watch("isHealthy", true);

  useEffect(() => {
    if (watchedIsHealthy) {
      setValue("symptom", []);
      setValue("other", []);
    }
  }, [watchedIsHealthy, setValue]);

  useEffect(() => {
    if (watchedSymptom.length > 0 || watchedOther.length > 0) {
      setValue("isHealthy", false);
    }
  }, [watchedSymptom, watchedOther, setValue]);

  useEffect(() => {
    if (existingData.symptom) {
      const otherSymptom = existingData.symptom.find((item) => item.startsWith('기타: '));
      if (otherSymptom) {
        const detailText = otherSymptom.replace('기타: ', '').trim();
        setValue('otherDetail', detailText);

        setValue('symptom', [...existingData.symptom.filter((item) => !item.startsWith('기타: ')), '기타']);
      } else {
        setValue('symptom', existingData.symptom);
      }
    }
  }, [existingData, setValue]);

  useEffect(() => {
    if (existingData.other) {
      setValue("other", existingData.other);
    }
  }, [existingData, setValue]);
  

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map((country) => ({
          value: country.cca2,
          label: country.name.common,
        }));
        setCountryOptions(countries);
      } catch (error) {
        console.error('국가 정보를 가져오는 중 오류 발생:', error);
      }
    };
    fetchCountries();
  }, []);

  const onSubmit = async (data) => {
    console.log("전송하려는 데이터:", data);
    const currentDate = new Date().toISOString().split('T')[0];

    let updatedData = {
      ...data,
      createdAt: existingData.createdAt || currentDate,
      updatedAt: currentDate,
    };

    if (updatedData.symptom.includes("기타") && updatedData.otherDetail && updatedData.otherDetail.trim() !== '') {
      updatedData.symptom = [...(updatedData.symptom || []), `기타: ${updatedData.otherDetail}`];
      updatedData.symptom = updatedData.symptom.filter((item) => item !== "기타");
    }

    delete updatedData.otherDetail;

    try {
      if (mode === 'new') {
        await axios.post(
          'https://670c91777e5a228ec1d0b2ca.mockapi.io/api/healthInfo',
          updatedData,
        );
        Swal.fire({
          title: '<strong>성공!</strong>',
          html: '<i>검역 정보가 저장되었습니다.</i>',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200,
        });
      } else if (mode === 'edit') {
        await onSave(updatedData);
        Swal.fire({
          title: '<strong>성공!</strong>',
          html: '<i>성공적으로 수정되었습니다.</i>',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
      Swal.fire({
        title: '오류!',
        text: '데이터 전송 중 오류가 발생했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      text: '이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      try {
        await onDelete(existingData.id);
        Swal.fire({
          title: '<strong>삭제 완료!</strong>',
          html: '<i>데이터가 성공적으로 삭제되었습니다.</i>',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        navigate('/');  // 삭제 후 목록 페이지로 이동
      } catch (error) {
        console.error('데이터 삭제 중 오류 발생:', error);
        Swal.fire({
          title: '오류!',
          text: '데이터 삭제 중 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.formHeader} ${styles.first}`}>
        {mode === 'edit' ? '입국자 정보 [수정]' : '입국자 정보'}
        <div className={styles.buttonGroup}>
          {mode === 'edit' && (
            <>
              <button type="submit" className={styles.saveButton} onClick={handleSubmit(onSubmit)}>저장</button>
              <button type="button" className={styles.deleteButton} onClick={handleDelete}>삭제</button>
            </>
          )}
        </div>
      </div>
      <div className={styles.formWrapper}>
        <Form ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <table>
            <tbody>
              <tr>
                <td colSpan={10}>
                  <Form.Group className={styles.inlineFormGroup}>
                    <Form.Label className={styles.formLabel}>이름</Form.Label>
                    <div className={styles.controlWrapper}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            className={styles.formControl}
                            isInvalid={!!errors.name}
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </td>
                <td >
                  <Form.Group className={styles.inlineFormGroup}>
                    <Form.Label className={styles.formLabel}>성별</Form.Label>
                    <div className={styles.radioGroup}>
                      <div className={styles.radioButtons}>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Form.Check
                                {...field}
                                type="radio"
                                value="남"
                                checked={field.value === '남'}
                                onChange={(e) => field.onChange(e.target.value)}
                                label="남성"
                                className={styles.radioInput}
                              />
                              <Form.Check
                                {...field}
                                type="radio"
                                value="여"
                                checked={field.value === '여'}
                                onChange={(e) => field.onChange(e.target.value)}
                                label="여성"
                                className={styles.radioInput}
                              />
                            </>
                          )}
                        />
                      </div>
                      {errors.gender && (
                        <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                          {errors.gender.message}
                        </Form.Control.Feedback>
                      )}
                    </div>
                  </Form.Group>
                </td>
              </tr>
              <tr>
                <td colSpan={6}>
                  <Form.Group className={styles.inlineFormGroup}>
                    <Form.Label className={styles.formLabel}>여권번호</Form.Label>
                    <div className={styles.controlWrapper}>
                      <Controller
                        name="passportId"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            className={styles.formControl}
                            type="text"
                            isInvalid={!!errors.passportId}
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                        {errors.passportId?.message}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </td>
                <td colSpan={4}>
                  <Form.Group className={styles.inlineFormGroup}>
                    <Form.Label className={styles.formLabel}>국적</Form.Label>
                    <div className={styles.controlWrapper}>
                      <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={countryOptions}
                            value={countryOptions.find(option => option.value === field.value)}
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption ? selectedOption.value : '')
                            }
                            placeholder="국적을 선택하세요"
                            isSearchable
                            maxMenuHeight={150}
                            styles={{
                              control: (base) => ({

                                ...base,
                                height: '1rem',
                                minHeight: '2rem',
                                minWidth: '150px',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.75rem',
                                paddingBottom: '1.1rem',
                              }),
                            }}
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                        {errors.nationality?.message}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </td>
                <td colSpan={2}>
                  <Form.Group className={styles.inlineFormGroup}>
                    <Form.Label className={styles.formLabel}>생년월일</Form.Label>
                    <div className={styles.controlWrapper}>
                      <Controller
                        name="birthdate"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            type="date"
                            className={styles.formControl}
                            isInvalid={!!errors.birthdate}
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                        {errors.birthdate?.message}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </td>
              </tr>
              <tr>
                <td colSpan={10}>
                  <Form.Group className={styles.inlineFormGroup}>
                    <Form.Label className={styles.formLabel}>주소</Form.Label>
                    <div className={styles.controlWrapper}>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            className={styles.formControl}
                            type="text"
                            isInvalid={!!errors.address}
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                        {errors.address?.message}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </td>
                <td>
                  <Form.Group className={styles.inlineFormGroup}>
                    <Form.Label className={styles.formLabel}>연락처</Form.Label>
                    <div className={styles.controlWrapper}>
                      <Controller
                        name="contact"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            className={styles.formControl}
                            type="text"
                            isInvalid={!!errors.contact}
                          />
                        )}
                      />
                      <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                        {errors.contact?.message}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                </td>
              </tr>
            </tbody>
          </table>
          <h2 className={`${styles.formHeader} ${styles.second}`}>여행 정보</h2>
          <fieldset className={styles.fieldset}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Form.Group className={styles.inlineFormGroup}>
                      <Form.Label className={styles.formLabel}>출발국가</Form.Label>
                      <div className={styles.controlWrapper}>
                        <Controller
                          name="departure"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={countryOptions}
                              value={countryOptions.find((option) => option.value === field.value)}
                              onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : '')}
                              placeholder="출발국가를 선택하세요"
                              isSearchable
                              maxMenuHeight={150}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  height: '1rem',
                                  minHeight: '2rem',
                                  minWidth: '150px',
                                  border: '1px solid #ccc',
                                  borderRadius: '5px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontSize: '0.75rem',
                                  paddingBottom: '1.1rem',
                                }),
                                container: (base) => ({
                                  ...base,
                                  width: '100%',
                                }),
                              }}
                            />
                          )}
                        />
                        {errors.departure && (
                          <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                            {errors.departure.message}
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group className={styles.inlineFormGroup}>
                      <Form.Label className={styles.formLabel}>항공편명</Form.Label>
                      <div className={styles.controlWrapper}>
                        <Controller
                          name="flightCode"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              className={styles.formControl}
                              isInvalid={!!errors.flightCode}
                            />
                          )}
                        />
                        <Form.Control.Feedback type="invalid" className={styles.invalidFeedback}>
                          {errors.flightCode?.message}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </td>
                  <td>
                    <Form.Group className={styles.inlineFormGroup}>
                      <Form.Label className={styles.formLabel}>좌석번호</Form.Label>
                      <div className={styles.controlWrapper}>
                        <Controller
                          name="seatNumber"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              className={styles.formControl}
                              isInvalid={!!errors.seatNumber}
                            />
                          )}
                        />
                        <Form.Control.Feedback type="invalid" className={styles.invalidFeedback} >
                          {errors.seatNumber?.message}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>

                  </td>
                </tr>
              </tbody>
            </table>

            <Form.Group className={styles.inlineFormGroup}>
              <Form.Label className={styles.formLabel}>방문 국가 (최근 21일)</Form.Label>
              <div className={styles.controlWrapper}>
                <Controller
                  name="visitCountry"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countryOptions}
                      isMulti
                      value={countryOptions.filter(option => field.value.includes(option.value))}
                      onChange={(selectedOptions) => field.onChange(selectedOptions.map(option => option.value))}
                      placeholder="방문한 국가를 선택하세요 (최대 4개)"
                      isSearchable
                      maxMenuHeight={150}
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: '1rem',
                          minHeight: '2rem',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          paddingBottom: '1.1rem',
                        }),
                        container: (base) => ({
                          ...base,
                          width: '100%',
                        }),
                      }}
                    />
                  )}
                />
              </div>
            </Form.Group>
          </fieldset>

          <div className={existingData.isHealthy ? `${styles.formHeader} ${styles.third}` : `${styles.formHeader} ${styles.symptoms}`}>건강상태 정보
            <Form.Group className={styles.formHeaderButton}>
              <Controller name="isHealthy" control={control} render={({ field }) => <Form.Check type="checkbox" label="증상 없음" {...field} checked={field.value} />} />
            </Form.Group></div>
          <fieldset className={styles.fieldset}>

            <div className={`${styles.inlineFormGroup} ${styles.symptoms}`}>
              <div >
                <table name='symptomTable' className={styles.symptomTable}>
                  <th colSpan={4}>증상</th>
                  <tbody>
                    <tr>
                      <td className={watchedSymptom.includes("발열") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="발열" label="발열" checked={field.value?.includes("발열")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("오한") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="오한" label="오한" checked={field.value?.includes("오한")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("두통") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="두통" label="두통" checked={field.value?.includes("두통")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("인후통") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="인후통" label="인후통" checked={field.value?.includes("인후통")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td className={watchedSymptom.includes("콧물") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="콧물" label="콧물" checked={field.value?.includes("콧물")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("기침") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="기침" label="기침" checked={field.value?.includes("기침")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("호흡곤란") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="호흡곤란" label="호흡곤란" checked={field.value?.includes("호흡곤란")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("복통/설사") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="복통/설사" label="복통/설사" checked={field.value?.includes("복통/설사")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td className={watchedSymptom.includes("구토") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="구토" label="구토" checked={field.value?.includes("구토")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("발진") ? styles.checkedCell : ''} >
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="발진" label="발진" checked={field.value?.includes("발진")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("황달") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="황달" label="황달" checked={field.value?.includes("황달")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td className={watchedSymptom.includes("의식 저하") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="의식 저하" label="의식 저하" checked={field.value?.includes("의식 저하")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td className={watchedSymptom.includes("점막 지속 출혈") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="점막 지속 출혈" label="점막 지속 출혈" checked={field.value?.includes("점막 지속 출혈")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                      <td colSpan={3} className={watchedSymptom.includes("기타") ? styles.checkedCell : ''}>
                        <Form.Group className={`${styles.inlineFormGroup} ${styles.other}`}>
                          <Controller name="symptom" control={control} render={({ field }) => <Form.Check type="checkbox" value="기타" label="기타" checked={field.value?.includes("기타")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                          <Controller name="otherDetail" control={control} render={({ field }) => <Form.Control className={styles.formControl} type="text" {...field} value={field.value || ''} />} />
                        </Form.Group>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br />
              <div>
                <table className={styles.symptomTable}>
                  <th colSpan={4}>의심 활동</th>
                  <tbody>
                    <tr>
                      <td className={watchedOther.includes("증상 관련 약 복용") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="other" control={control} render={({ field }) => <Form.Check type="checkbox" value="증상 관련 약 복용" label="증상 관련 약 복용" checked={field.value?.includes("증상 관련 약 복용")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td className={watchedOther.includes("현지 병원 방문") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="other" control={control} render={({ field }) => <Form.Check type="checkbox" value="현지 병원 방문" label="현지 병원 방문" checked={field.value?.includes("현지 병원 방문")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                    </tr>
                    <tr>
                      <td className={watchedOther.includes("동물 접촉") ? styles.checkedCell : ''}>
                        <Form.Group>
                          <Controller name="other" control={control} render={({ field }) => <Form.Check type="checkbox" value="동물 접촉" label="동물 접촉" checked={field.value?.includes("동물 접촉")} onChange={(e) => field.onChange(e.target.checked ? [...(field.value || []), e.target.value] : field.value.filter((val) => val !== e.target.value))} />} />
                        </Form.Group>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <Form.Group className={styles.inlineFormGroup}>
              <Form.Label className={styles.formLabel}>비고</Form.Label>
              <div className={styles.controlWrapper}>
                <Controller name="note" control={control} render={({ field }) => <Form.Control className={styles.formControl} type="text" {...field} />} />
              </div>
            </Form.Group>
          </fieldset>
        </Form>
      </div>
    </div>
  );
});

export default QuarantineForm;
