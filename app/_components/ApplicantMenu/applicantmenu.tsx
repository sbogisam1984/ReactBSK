import React from "react";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import WizardType from "@/app/_types/WizardStepsType";
import { stepItems } from "@/app/(OpenAccount)/StepIndexes";

const ApplicationMenu = ({ activeStepIndex }: WizardType) => {
    return (
        <div className="application-menu ml-[50px]">
            <ul className="list-none bg-[rgb(210,210,210)] w-[20vw] text-2xl">
                {stepItems.map((mItem, index) => (
                    <li
                        className={`flex items-center justify-center py-[0.2em] text-center ${index === activeStepIndex ? "font-semibold" : undefined
                            }`}
                        key={mItem.title}
                    >
                        {mItem.title}
                        {index < activeStepIndex && (
                            <TaskAltOutlinedIcon className="ml-2" sx={{ color: "green" }} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApplicationMenu;
