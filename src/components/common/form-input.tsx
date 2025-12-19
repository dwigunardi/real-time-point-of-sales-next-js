import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function FormInput<T extends FieldValues>({
    form,
    name,
    label,
    placeholder,
    type = 'text',
    selectValue,
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    selectValue?: string[];
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field: { ...rest } }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {type === 'textarea' ? (
                            <Textarea
                                {...rest}
                                placeholder={placeholder}
                                autoComplete="off"
                                className="resize-none"
                            />
                        ) : type === 'select' ? (
                            <Select onValueChange={rest.onChange} defaultValue={rest.value}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent className='hover:scrollbar-thumb-primary/80 scrollbar-track-transparent scrollbar-thin scrollbar-thumb-rounded-md'>
                                    {selectValue?.map((option: string, index: number) => (
                                        <SelectItem key={index} value={option} className='hover:!bg-cyan-600'>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                {...rest}
                                type={type}
                                placeholder={placeholder}
                                autoComplete="off"
                            />
                        )}
                    </FormControl>
                    <FormMessage className="text-xs" />
                </FormItem>
            )}
        />
    );
}