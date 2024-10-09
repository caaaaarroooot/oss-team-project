import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const RecipeForm = () => {

  const initialState = {
    createdAt: "",
    imageUrl: "",
    foodName: "",
    chefName: "",
    chefClass: "",
    cuisineType: [],
    weather: "",
    ingredient: [],
    cookingStep: "",
    updatedAt: ""
  };

  const [recipe, setRecipe] = useState(initialState); // 레시피 초기화

  const [ingredient, setIngredient] = useState([{ id: 1, name: "", amount: "" }]); // 재료 상태 관리

  // 폼 입력 변경
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: checked ? [...prevRecipe[name], value] : prevRecipe[name].filter((v) => v !== value)
      }));
    } else {
      setRecipe({
        ...recipe,
        [name]: value,
      });
    }
  };

  // 재료칸 추가
  const addIngredientRow = () => {
    const newId = ingredient.length + 1;
    setIngredient([...ingredient, { id: newId, name: "", amount: "" }]);
  };

  //재료칸 삭제
  const removeIngredientRow = (index) => {
    if (ingredient.length === 1) {
      alert("최소한 하나의 재료는 필요합니다.");
      return;
    }
    setIngredient(ingredient.filter((_, i) => i !== index));
  };

  // 재료
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...ingredient];
    updatedIngredients[index][name] = value;
    setIngredient(updatedIngredients);
  };

  // 폼 제출 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString();

    try {
      const url = "https://67067ccaa0e04071d22715a6.mockapi.io/api/recipes";

      const recipeData = {
        ...recipe,
        ingredient: ingredient, 
        cookingStep: recipe.cookingStep, 
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      // 데이터 전송
      const response = await axios.post(url, recipeData);
      console.log("레시피 추가됨:", response.data);

      alert("레시피가 추가되었습니다.");

      // 폼 상태 초기화
      setRecipe(initialState);
      setIngredient([{ id: 1, name: "", amount: "" }]); 
    }
    catch (error) {
      console.error("레시피 추가 실패:", error);
      alert("레시피 추가에 실패했습니다.");
    }
  };


  // 폼 상태를 초기값으로 돌림
  const handleCancel = () => {
    setRecipe(initialState); 
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mt-4">레시피 추가</h2>
          <Form onSubmit={handleSubmit}>

            {recipe.imageUrl && (
              <div className="text-center mb-3">
                <img
                  src={recipe.imageUrl}
                  alt="미리보기 이미지"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Image+not+found"
                  }}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            )}

            {/* 요리 사진 */}
            <Form.Group controlId="imageUrl" className="mb-3">
              <Form.Label>이미지 링크</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={recipe.imageUrl}
                onChange={handleChange}
                placeholder="이미지 링크 주소를 입력하세요"
                required
              />
            </Form.Group>

            {/* 요리 이름 */}
            <Form.Group controlId="foodName" className="mb-3">
              <Form.Label>요리 이름</Form.Label>
              <Form.Control
                type="text"
                name="foodName"
                value={recipe.foodName}
                onChange={handleChange}
                placeholder="예) 이븐하게 익지 않은 보섭살"
                required
              />
            </Form.Group>

            {/* 요리사 이름 */}
            <Form.Group controlId="chefName" className="mb-3">
              <Form.Label>요리사 이름</Form.Label>
              <Form.Control
                type="text"
                name="chefName"
                value={recipe.chefName}
                onChange={handleChange}
                placeholder=""
                required
              />
            </Form.Group>

            {/* 요리사 계급 */}
            <Form.Group controlId="chefClass" className="mb-3">
              <Form.Label>요리사 계급: &nbsp; </Form.Label>
              <Form.Check
                inline
                type="radio"
                name="chefClass"
                label="흑수저"
                value="Black"
                checked={recipe.chefClass === "Black"}
                onChange={handleChange}
              />

              <Form.Check
                inline
                type="radio"
                name="chefClass"
                label="백수저"
                value="White"
                checked={recipe.chefClass === "White"}
                onChange={handleChange}
              />
            </Form.Group>

            {/* 장르 분류 */}
            <Form.Group controlId="cuisineType" className="mb-3">
              <Form.Label>분류: &nbsp; </Form.Label>

              <Form.Check
                inline
                type="checkbox"
                name="cuisineType"
                label="한식"
                value="Korean"
                checked={recipe.cuisineType.includes("Korean")}
                onChange={handleChange}
              />

              <Form.Check
                inline
                type="checkbox"
                name="cuisineType"
                label="일식"
                value="Japanese"
                checked={recipe.cuisineType.includes("Japanese")}
                onChange={handleChange}
              />

              <Form.Check
                inline
                type="checkbox"
                name="cuisineType"
                label="중식"
                value="Chinese"
                checked={recipe.cuisineType.includes("Chinese")}
                onChange={handleChange}
              />

              <Form.Check
                inline
                type="checkbox"
                name="cuisineType"
                label="멕시칸"
                value="Mexican"
                checked={recipe.cuisineType.includes("Mexican")}
                onChange={handleChange}
              />

              <Form.Check
                inline
                type="checkbox"
                name="cuisineType"
                label="양식"
                value="Western"
                checked={recipe.cuisineType.includes("Western")}
                onChange={handleChange}
              />

              <Form.Check
                inline
                type="checkbox"
                name="cuisineType"
                label="중동"
                value="MidEastAsian"
                checked={recipe.cuisineType.includes("MidEastAsian")}
                onChange={handleChange}
              />

              <Form.Check
                inline
                type="checkbox"
                name="cuisineType"
                label="기타"
                value="Other"
                checked={recipe.cuisineType.includes("Other")}
                onChange={handleChange}
              />
            </Form.Group>

            {/* 날씨 추천 */}
            <Form.Group controlId="weather" className="mb-3">
              <Form.Label>이 요리는, 언제 먹는 게 좋을까요?</Form.Label>
              <p>
                <Form.Check
                  inline
                  type="radio"
                  name="weather"
                  label="맑은 날"
                  value="Clear"
                  checked={recipe.weather === "Clear"}
                  onChange={handleChange}
                />

                <Form.Check
                  inline
                  type="radio"
                  name="weather"
                  label="흐린 날"
                  value="Clouds"
                  checked={recipe.weather === "Clouds"}
                  onChange={handleChange}
                />

                <Form.Check
                  inline
                  type="radio"
                  name="weather"
                  label="비 오는 날"
                  value="Rain"
                  checked={recipe.weather === "Rain"}
                  onChange={handleChange}
                />

                <Form.Check
                  inline
                  type="radio"
                  name="weather"
                  label="눈 오는 날"
                  value="Snow"
                  checked={recipe.weather === "Snow"}
                  onChange={handleChange}
                />

                <Form.Check
                  inline
                  type="radio"
                  name="weather"
                  label="천둥번개 치는 날"
                  value="Thunderstorm"
                  checked={recipe.weather === "Thunderstorm"}
                  onChange={handleChange}
                />
              </p>

            </Form.Group>

            {/* 재료 */}
            <Form.Label>재료: &nbsp; </Form.Label>
            {ingredient.map((ingredient, index) => (
              <Row key={index} className="mb-3">
                <Col>
                  <Form.Control
                    inline
                    type="text"
                    name="name"
                    placeholder="마늘"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, e)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    name="amount"
                    placeholder="한 알"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, e)}
                    required
                  />
                </Col>
                <Col>
                  <Button variant="danger" onClick={() => removeIngredientRow(index)}>
                    삭제
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="primary" onClick={addIngredientRow}>재료 추가 </Button>

            {/* 조리법 */}
            <Form.Group controlId="cookingStep" className="mb-3">
              <Form.Label>조리법</Form.Label>
              <Form.Control
                as="textarea"
                name="cookingStep"
                value={recipe.cookingStep}
                onChange={handleChange}
                placeholder="1. 마늘을 썬다. 2. 파채를 썬다."
                rows={3}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              추가
            </Button>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              취소
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RecipeForm;
