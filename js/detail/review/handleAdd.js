import { incrementReviewCount, reviewCount } from "./reviewCount.js";
import { reviewCnt, reviewContainer, errorMsgPar } from "./domElements.js";
import { movieId } from "../index.js";
import likeIcon from "../icon.js";

export const handleSubmit = (e) => {
  let review = {};
  let errorMessage = "";
  let likeCount = 0;
  const reviewInputs = document.querySelectorAll(".review-input");
  e.preventDefault();

  const [userName, userPassword, userReview] = [
    reviewInputs[0].value.trim(),
    reviewInputs[1].value.trim(),
    reviewInputs[2].value.trim(),
  ];

  if (userName.length < 2) {
    errorMessage = "작성자를 두 글자 이상 입력해 주세요.";
    errorMsgPar.innerHTML = errorMessage;
    return;
  } else {
    review["username"] = userName;
  }

  if (userPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(userPassword)) {
    errorMessage = "비밀번호를 특수문자를 포함한 8자 이상 입력해 주세요.";
    errorMsgPar.innerHTML = errorMessage;
    return;
  } else {
    review["password"] = userPassword;
  }

  if (userReview.length < 10) {
    errorMessage = "리뷰를 10자 이상 작성해 주세요.";
    errorMsgPar.innerHTML = errorMessage;
    return;
  } else {
    review["review"] = userReview;
  }

  const date = new Date();
  const [year, month, day, hour, minute] = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
    date.getHours().toString().padStart(2, "0"),
    date.getMinutes().toString().padStart(2, "0"),
  ];

  const submittedAt = `${year}-${month}-${day} ${hour}:${minute}`;
  review = { ...review, submittedAt, movieId, likeCount };

  const key = date.getTime();

  localStorage.setItem(key, JSON.stringify(review));
  addReview(review, key);

  reviewInputs.forEach((e) => (e.value = ""));
  errorMsgPar.innerHTML = "";
};

function addReview(review, key) {
  incrementReviewCount();
  const reviewRow = createReviewElement(review, reviewCount, key);
  reviewContainer.appendChild(reviewRow);
  likeIcon(key);
}

export function createReviewElement(reviewContent, reviewCount, key) {
  const { username, review, submittedAt, likeCount } = reviewContent;
  const reviewEmptyMessage = document.querySelector("#review-empty-msg");
  reviewEmptyMessage && reviewEmptyMessage.remove();
  reviewCnt.innerHTML = `리뷰 ${reviewCount}`;

  const reviewRow = document.createElement("li");
  reviewRow.setAttribute("id", "review-row");
  reviewRow.setAttribute("data-key", key);
  reviewRow.innerHTML = `
  <div id="review-box-top">
                    <p id="username-display">${username}</p>
                    <div id="review-btn-box">
                      <button id="edit-review-btn" class="detail-btn" data-key=${key}>수정</button>
                      <button id="delete-review-btn" class="detail-btn" data-key=${key}>삭제</button>
                    </div>
                  </div>
                  <div id="review-box-bottom">
                    <div id="review-content-box" data-key=${key}>
                      <p id="review-display">
                      ${review}
                      </p>
                    </div>
                    <div id="review-detail-box">
                      <p id="review-time">${submittedAt}</p>
                      <div id="like-wrapper-${key}">
                        <i class="fa-solid fa-heart" id="fa-solid-${key}"></i>
                        <i class="fa-regular fa-heart"id="fa-regular-${key}"></i>
                        <p id="like-count-${key}"></p>
                      </div>
                      </div>
                  </div>
                  <p id="edit-review-error-message"></p>
  `;

  return reviewRow;
}
