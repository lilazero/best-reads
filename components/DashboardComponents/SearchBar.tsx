import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePositioner,
} from "@/components/ui/autocomplete";
import { tags } from "../../lib/mockData";
export default function SearchBar() {
  return (
    <>
      <div className="w-full max-w-2xl">
        <Autocomplete items={tags} autoHighlight>
          <AutocompleteInput
            id="tags"
            placeholder="exempli gratia: Code Complete"
            className="mt-2 bg-white"
          />
          <AutocompletePositioner sideOffset={6}>
            <AutocompletePopup>
              <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
              <AutocompleteList>
                {(tag) => (
                  <AutocompleteItem key={tag.id} value={tag.value}>
                    {tag.value}
                  </AutocompleteItem>
                )}
              </AutocompleteList>
            </AutocompletePopup>
          </AutocompletePositioner>
        </Autocomplete>
      </div>
    </>
  );
}
