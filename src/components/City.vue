<script setup lang="ts">
import type { City } from "@/types";
import { useCityBehavior } from "@/composables/useCityBehavior";

const props = defineProps<{ city: City }>();
const emit = defineEmits<{ (e: "close"): void }>();

const {
  loading,
  error,
  details,
  places,
  placesLoading
} = useCityBehavior(props.city);

</script>