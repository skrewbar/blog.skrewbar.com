$(document).ready(function () {
  const ratingClasses = [
    'cf-newbie',
    'cf-pupil',
    'cf-specialist',
    'cf-expert',
    'cf-candidate-master',
    'cf-master',
    'cf-grandmaster',
    'cf-legendary-grandmaster'
  ];

  function getClassByRating(rating) {
    if (rating < 1200) return 'cf-newbie';
    if (rating < 1400) return 'cf-pupil';
    if (rating < 1600) return 'cf-specialist';
    if (rating < 1900) return 'cf-expert';
    if (rating < 2100) return 'cf-candidate-master';
    if (rating < 2400) return 'cf-master';
    if (rating < 3000) return 'cf-grandmaster';
    return 'cf-legendary-grandmaster';
  }

  $('.cf-rating').each(function () {
    const $el = $(this);
    const text = ($el.text() || '').trim();
    const normalized = text.replace(/[^\d-]/g, '');
    const rating = parseInt(normalized, 10);

    if (isNaN(rating)) {
      return;
    }

    $el.removeClass(ratingClasses.join(' '));
    $el.addClass(getClassByRating(rating));
  });
});
