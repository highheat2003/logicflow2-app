import { ref, watch } from 'vue';

export default function useKonvaEdit(konvaHelper) {
  const isReadOnly = ref(false);

  watch(isReadOnly, (newVal) => {
    konvaHelper.setReadOnly(newVal);
  });

  return { isReadOnly };
}
