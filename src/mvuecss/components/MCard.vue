<template>
  <section class="m-card">
    <div class="m-card__body">
      <slot name="body"></slot>
    </div>
    <div class="m-card__actions">
      <slot name="actions"></slot>
    </div>
  </section>
</template>

<script>
export default {};
</script>