# 뉴스 뷰어(리액트를 다루는 기술 참고)

## 중점 사항

- ### styled components
- ### 리액트 라우터 v6
- ### effect hook 사용 시 주의사항

<br/>

---

<br/>

## 프로젝트 개요

_newsapi.org_ API를 이용해 주요 뉴스를 보여주는 앱을 구현했습니다.

axios 라이브러리를 사용한 비동기처리, styled components를 이용한 스타일링, 리액트 라우터를 통한 라우팅을 초심자의 입장에서 배우기 좋은 프로젝트입니다.

<br/>

---

<br/>

## Styled Components

처음엔 익숙한 postCSS를 사용하려 했지만 새로운 기술을 익혀보자는 생각에 책 그대로의 방식을 따랐습니다.

```javascript
const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 1rem;
  }
`;

return <NewsListBlock>Loading...</NewsListBlock>;
```

styeld componetns는 다음과 같은 방식으로 작동합니다. js 파일 내부에 스타일링 코드를 작성할 수 있는데 이게 좋은 방식인지는 확신이 안 듭니다.

아직은 경험이 많지 않아 조심스럽지만 분리해서 처리하는 게 더 깔끔하지 않을까요?

지금처럼 앱의 규모가 작을 때는 채택해도 괜찮을 것 같습니다.

props를 받아 조건부 스타일링을 하는 부분은 굉장히 편리했습니다.

```javascript
<Category
  key={c.name}
  active={category === c.name}
  onClick={() => onSelect(c.name)}
/>

// 다음과 같은 경우 props.acitve로 active 속성에 접근 가능
```

<br/>

---

<br/>

## 리액트 라우터 V6

프로젝트를 하면서 제일 큰 난관을 겪었던 부분입니다. 기존에 v5에 대한 사전지식이 있었는데 개편된 v6를 적용하면서 혼란을 겪은 부분들이 많았습니다.

---

### optional URL 파라미터

```javascript
<Routes>
  <Route path='/:category' element={<NewsPages newsManager={newsManager} />} />
  <Route path='/' element={<NewsPages newsManager={newsManager} />} />;
</Routes>
```

리액트 라우터 v6에선 optional URL 파라미터가 사라졌습니다. 대신에 위와 같이 Route를 여러 번 쓴다면 해결할 수 있습니다.

참고로 Route는 항상 Routes(v5에서 Switch)의 자식이어야 합니다.

---

### NavLink

NavLink에도 몇 가지 변경사항이 있습니다.

```javascript
const Category = styled(NavLink)`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  &:hover {
    color: #495057;
  }

  &.active {
    font-weight: 600;
    border-bottom: 2px solid #22b8cf;
    color: #22b8cf;
    &:hover {
      color: #3bc9db;
    }
  }

  & + & {
    margin-left: 1rem;
  }
`;

<Category key={c.name} to={c.name === "all" ? "/" : `/${c.name}`}>
  {c.text}
</Category>;
```

기존 v5에선 activeClassName, activeStyle을 사용했지만 v6에선 className, style에 isActive를 인자로 받는 함수를 이용해 설정할 수 있습니다.

프로젝트에선 단순히 active 값에 따라 스타일이 변하게 만들었습니다.

<br/>

---

<br/>

## effect hook 사용 시 주의사항

이펙트 훅은 함수를 반환합니다.(clean 함수) 그렇기 때문에 비동기 처리를 할 시 약간의 주의사항이 있습니다.

```javascript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await newsManager.fetchData(category);
      setArticles(response.articles);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  fetchData();
}, [newsManager, category]);

// news_list.jsx 파일
```

보이는 것처럼 이펙트 훅 내부에서 함수를 하나 선언하고 그 함수를 호출하는 형식으로 구현했습니다.

async 함수는 암묵적으로 promise를 반환하기 때문에 useEffect의 콜백에 바로 async를 쓰면 콘솔 창에서 경고를 울립니다.

솔직한 생각으론 이게 문제가 된다는 건 알겠지만 체감이 되질 않습니다.

연습을 거듭하면서 직접적으로 체감해야 가슴 속으로 받아들일 수 있을 것 같습니다.

<br/>

---

<br/>

## tip

### 객체에 조건부로 속성을 추가하는 법

```javascript
  async fetchData(query) {
    const params = {
      country: "kr",
      ...(query !== "all" && { category: query }),
      apikey: this.key,
    };

    const ax = axios.create({
      baseURL: this.baseURL,
      params: params,
    });

    const response = await ax.get("/top-headlines");

    return response.data;
  }

  /// news.js 파일
```

axios instance를 생성할 때 params를 설정해야합니다.

하지만 newsapi.org에서 전체보기는 params에 category=all이 아니라 category parameter 자체가 없는 상황이었습니다.

if 문을 사용하면 편리하게 해결할 수 있지만 그렇게 할 경우 코드가 너무 지저분해질 것 같아 다른 방안을 찾아봤습니다.

위와 같은 코드처럼 spread 연산자와 && 연산자를 활용하면 깔끔하게 구현할 수 있습니다.
